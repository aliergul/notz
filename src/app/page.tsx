import LoginButton from "@/components/auth/LoginButton";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Not ve Todo Uygulaması</h1>
      {/* test */}
      <LoginButton />
    </main>
  );
}
