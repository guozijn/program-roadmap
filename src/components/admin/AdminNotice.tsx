interface AdminNoticeProps {
  tone: "success" | "info" | "error";
  message: string;
}

const NOTICE_STYLES: Record<AdminNoticeProps["tone"], string> = {
  success: "bg-green-50 border-green-200 text-green-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
  error: "bg-red-50 border-red-200 text-red-700",
};

export default function AdminNotice({ tone, message }: AdminNoticeProps) {
  return (
    <div className={`border px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${NOTICE_STYLES[tone]}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {tone === "success" ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : tone === "info" ? (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h.01M11 12h1v4h1" />
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
          </>
        ) : (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01" />
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
          </>
        )}
      </svg>
      <span>{message}</span>
    </div>
  );
}
