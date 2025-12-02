import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    window.document.title = "Not Found | Claims Management System";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}
