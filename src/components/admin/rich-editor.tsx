"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { uploadFile } from "@/lib/admin/api";

export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const editorRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      {!ready && (
        <div className="grid h-64 place-items-center bg-surface-2/60 text-sm text-muted-foreground">
          Loading editor…
        </div>
      )}
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          setReady(true);
        }}
        value={value}
        onEditorChange={(html) => onChange(html)}
        init={{
          height: 520,
          menubar: false,
          branding: false,
          promotion: false,
          skin: isDark ? "oxide-dark" : "oxide",
          content_css: isDark ? "dark" : "default",
          plugins:
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table wordcount codesample quickbars",
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | link image media codesample blockquote | align | bullist numlist | removeformat code fullscreen",
          quickbars_selection_toolbar: "bold italic | quicklink blockquote",
          content_style:
            "body{font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:16px;line-height:1.7}",
          images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
            const file = new File([blobInfo.blob()], blobInfo.filename());
            const { url } = await uploadFile(file);
            return url;
          },
        }}
      />
    </div>
  );
}
