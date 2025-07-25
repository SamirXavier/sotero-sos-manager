
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-gradient-to-b from-sotero-blue/10 to-sotero-purple/10 border-sotero-blue/20 shadow-lg px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-sotero-blue hover:bg-sotero-blue/10" />
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-sotero-blue">Sistema SOS - Sotero Ambiental</h2>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-sotero-blue">{user.name}</p>
            <Badge variant="secondary" className="text-xs bg-sotero-blue/10 text-sotero-blue border-sotero-blue/20">
              {user.role}
            </Badge>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
