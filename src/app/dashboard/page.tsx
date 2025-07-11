import LoginButton from "@/components/auth/LoginButton";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Hoş geldiniz! Burası sadece giriş yapanların görebileceği özel alan.
      </p>
      <div className="mt-5">
        <LoginButton />
      </div>
    </div>
  );
}
