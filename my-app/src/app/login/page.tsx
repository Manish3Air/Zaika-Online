export default function LoginPage() {
  return (
    <div className="flex justify-center mt-20">
      <a
        href="/api/auth/google"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg"
      >
        Login with Google
      </a>
    </div>
  );
}
