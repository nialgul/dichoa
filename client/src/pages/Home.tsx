import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowRight, Shield, MessageSquare, Settings } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // 인증된 관리자는 대시보드로 자동 이동
  if (isAuthenticated && user?.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">환영합니다!</h1>
          <p className="text-gray-600 mb-6">
            {user?.name}님, 관리자 대시보드로 이동 중입니다...
          </p>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="w-full"
          >
            대시보드로 이동
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choa Manager</h1>
            <p className="text-sm text-gray-600">관리자 대시보드</p>
          </div>
          {!isAuthenticated && (
            <Button onClick={() => setLocation("/auth/login")} variant="default">
              로그인
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discord 봇 관리를 쉽게
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            웹 기반 관리자 대시보드에서 봇 설정과 문의를 한 곳에서 관리하세요
          </p>
          {!isAuthenticated && (
            <Button
              onClick={() => setLocation("/auth/login")}
              size="lg"
              className="gap-2"
            >
              시작하기
              <ArrowRight size={20} />
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              안전한 관리
            </h3>
            <p className="text-gray-600">
              관리자 전용 접근 제어로 안전하게 봇을 관리하세요
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              문의 관리
            </h3>
            <p className="text-gray-600">
              사용자 문의를 효율적으로 관리하고 응답하세요
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Settings className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              봇 설정
            </h3>
            <p className="text-gray-600">
              서버별 봇 설정을 간편하게 관리하세요
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-blue-600 text-white py-12 md:py-16 mt-12">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              지금 시작하세요
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Discord OAuth로 안전하게 로그인하고 관리자 기능을 이용하세요
            </p>
            <Button
              onClick={() => setLocation("/auth/login")}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              로그인하기
              <ArrowRight size={20} />
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p>&copy; 2026 Choa Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
