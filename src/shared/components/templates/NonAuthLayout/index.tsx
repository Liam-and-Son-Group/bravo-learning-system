import LogoApp from "@/assets/svg/logo";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/domains/auth/storage";
import { Button } from "../../ui/button";

export default function NonAuthTemplate() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const handleLogoClick = () => {
    navigate({ to: accessToken ? "/" : "/login" });
  };
  return (
    <div className="max-h-screen overflow-auto">
      <div className="flex flex-col mx-auto w-full max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center pt-10">
          <Button
            variant="ghost"
            type="button"
            onClick={handleLogoClick}
            aria-label="Go to start"
            className="p-0 hover:bg-transparent focus-visible:ring-0 h-[70px] w-[100px]"
          >
            <LogoApp height={70} width={100} className="!w-full !h-full" />
          </Button>
          <p className="flex text-sm gap-2">
            Want to try PRO version in 30 days?
            <Link className="text-blue-600" to="/login">
              Let's go!
            </Link>
          </p>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
