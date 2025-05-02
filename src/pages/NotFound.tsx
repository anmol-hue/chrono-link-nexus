
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark bg-cyber-grid bg-[length:30px_30px]">
      <div className="text-center max-w-md cyber-panel p-8 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-neon-glow animate-pulse-soft">404</h1>
        <p className="text-xl text-white/80 mb-6">This dimension doesn't exist</p>
        <div className="mb-8 text-white/60">
          The communication channel you're trying to reach could not be found in this timeline.
        </div>
        <Link to="/">
          <Button className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/40">
            Return to Base Station
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
