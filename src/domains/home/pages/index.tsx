import WelcomeNotificationCenter from "../components/welcome-notification";

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="max-w-5xl m-auto">
        <div className="flex flex-col gap-4 mt-10">
          <p className="text-3xl font-medium">Welcome, Lam Nguyen!</p>
          <WelcomeNotificationCenter />
        </div>
      </div>
    </div>
  );
}
