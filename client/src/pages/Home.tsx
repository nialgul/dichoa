import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowRight, Shield, MessageSquare, Settings } from "lucide-react";
import { startLogin } from "@/const";

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
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choa Manager</h1>
            <p className="text-sm text-gray-600">관리자 대시보드</p>
          </div>
          {!isAuthenticated && (
            <Button onClick={() => startLogin()} variant="default">
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
              onClick={() => startLogin()}
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
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">보안 관리</h3>
            <p className="text-gray-600">
              Discord OAuth 2.0 인증과 JWT 기반 세션 관리로 안전한 접근 제어
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <MessageSquare className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">문의 관리</h3>
            <p className="text-gray-600">
              웹 기반 문의 시스템과 Discord 웹훅 알림으로 효율적인 관리
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Settings className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">봇 설정</h3>
            <p className="text-gray-600">
              서버별 봇 설정과 웹훅 관리를 한 곳에서 통합 관리
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            지금 시작하세요
          </h3>
          <p className="text-gray-600 mb-8">
            Discord 계정으로 로그인하고 관리자 대시보드에 접근하세요
          </p>
          {!isAuthenticated && (
            <Button
              onClick={() => startLogin()}
              size="lg"
              className="gap-2"
            >
              Discord로 로그인
              <ArrowRight size={20} />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-center text-gray-600">
          <p>&copy; 2026 Choa Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
