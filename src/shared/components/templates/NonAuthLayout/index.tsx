import LogoApp from "@/assets/svg/logo";
import { Link, Outlet } from "@tanstack/react-router";

export default function NonAuthTemplate() {
  return (
    <div className="max-h-screen overflow-auto">
      <div className="flex flex-col mx-auto w-full max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center pt-10">
          <LogoApp height={70} width={100} />
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
