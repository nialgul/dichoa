import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, LogOut, Settings, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // 관리자 권한 확인
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
          <p className="text-gray-600 mb-6">
            관리자만 이 페이지에 접근할 수 있습니다.
          </p>
          <Button onClick={() => setLocation("/")} variant="default">
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
      toast.success("로그아웃되었습니다");
    } catch (error) {
      toast.error("로그아웃 실패");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 md:z-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Choa Manager</h1>
          <p className="text-sm text-gray-600 mt-1">관리자 대시보드</p>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              setLocation("/dashboard");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
          >
            <Settings size={20} />
            <span>대시보드</span>
          </button>

          <button
            onClick={() => {
              setLocation("/dashboard/inquiries");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
          >
            <MessageSquare size={20} />
            <span>문의 관리</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut size={16} className="mr-2" />
            로그아웃
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h2 className="text-xl font-semibold text-gray-900 flex-1 md:flex-none">
            관리자 대시보드
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">환영합니다!</h3>
              <p className="text-gray-600 mb-4">
                좌측 메뉴에서 관리 기능을 선택하세요.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    문의 관리
                  </h4>
                  <p className="text-sm text-blue-700">
                    사용자로부터 접수된 문의를 관리하고 응답합니다.
                  </p>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    봇 설정
                  </h4>
                  <p className="text-sm text-green-700">
                    Discord 서버별 봇 설정을 관리합니다.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
