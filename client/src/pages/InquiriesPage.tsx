import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Menu, X, LogOut, Settings, MessageSquare, Plus, Check, X as XIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function InquiriesPage() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [serverId, setServerId] = useState("test-server");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    email: "",
  });

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

  const handleCreateInquiry = async () => {
    if (!formData.title || !formData.content || !formData.email) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }

    try {
      // TODO: API 호출
      toast.success("문의가 접수되었습니다");
      setFormData({ title: "", content: "", email: "" });
      setShowInquiryForm(false);
    } catch (error) {
      toast.error("문의 접수 실패");
    }
  };

  const handleCloseInquiry = async (inquiryId: number) => {
    try {
      // TODO: API 호출
      toast.success("문의가 종료되었습니다");
      setSelectedInquiry(null);
    } catch (error) {
      toast.error("문의 종료 실패");
    }
  };

  // Mock data
  const mockInquiries = [
    {
      id: 1,
      title: "봇 설정 문제",
      content: "봇이 응답하지 않습니다",
      email: "user@example.com",
      status: "open",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "기능 요청",
      content: "새로운 기능을 추가해주세요",
      email: "user2@example.com",
      status: "closed",
      createdAt: new Date(),
    },
  ];

  const filteredInquiries = useMemo(() => {
    if (statusFilter === "all") return mockInquiries;
    return mockInquiries.filter((i) => i.status === statusFilter);
  }, [statusFilter]);

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
            className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-3 text-blue-700 font-medium"
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
            문의 관리
          </h2>

          <Button
            onClick={() => setShowInquiryForm(true)}
            className="gap-2"
            size="sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">문의 시작</span>
          </Button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                전체
              </Button>
              <Button
                variant={statusFilter === "open" ? "default" : "outline"}
                onClick={() => setStatusFilter("open")}
                size="sm"
              >
                열림
              </Button>
              <Button
                variant={statusFilter === "closed" ? "default" : "outline"}
                onClick={() => setStatusFilter("closed")}
                size="sm"
              >
                종료됨
              </Button>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">문의가 없습니다</p>
                </Card>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <Card
                    key={inquiry.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {inquiry.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {inquiry.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs text-gray-500">
                            {inquiry.email}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          inquiry.status === "open" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {inquiry.status === "open" ? "열림" : "종료됨"}
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Inquiry Form Dialog */}
      <Dialog open={showInquiryForm} onOpenChange={setShowInquiryForm}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>문의 시작</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                제목
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="문의 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                이메일
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                내용
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="문의 내용을 입력하세요"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowInquiryForm(false)}
              >
                취소
              </Button>
              <Button onClick={handleCreateInquiry}>제출</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedInquiry?.title}</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  상태
                </label>
                <Badge
                  variant={
                    selectedInquiry.status === "open" ? "default" : "secondary"
                  }
                >
                  {selectedInquiry.status === "open" ? "열림" : "종료됨"}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  이메일
                </label>
                <p className="text-sm text-gray-600">{selectedInquiry.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  내용
                </label>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedInquiry.content}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  접수 날짜
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                {selectedInquiry.status === "open" && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleCloseInquiry(selectedInquiry.id)
                    }
                  >
                    <Check size={16} className="mr-2" />
                    문의 종료
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
