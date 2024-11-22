import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to={"/"} className="flex items-center gap-3">
      <span className="size-6 rounded-full border-2 border-indigo-300 bg-gradient-to-br from-indigo-300 to-indigo-200"></span>
      <p className="text-xl font-semibold">Soda</p>
    </Link>
  );
};
