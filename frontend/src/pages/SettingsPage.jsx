import ThemeToggle from "../components/ThemeToggle";

const SettingsPage = () => {
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-3xl">
      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold mb-2">Appearance</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Switch between light and dark mode with a smooth transition
          </p>
          <ThemeToggle />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <p className="text-sm text-base-content/70">Coming soon</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Privacy</h2>
          <p className="text-sm text-base-content/70">Coming soon</p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
