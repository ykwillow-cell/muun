import { motion } from "framer-motion";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { ChevronLeft, Mail, MessageSquare, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Contact() {
  useCanonical('/contact');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 본문 구성
    const body = `이름: ${formData.name}\n이메일: ${formData.email}\n\n내용:\n${formData.message}`;
    
    // mailto 링크 생성
    const mailtoUrl = `mailto:ykwillow1@naver.com?subject=${encodeURIComponent(`[무운 문의] ${formData.subject}`)}&body=${encodeURIComponent(body)}`;
    
    // 새 창에서 메일 앱 열기
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">문의하기</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <section className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-white">문의하기</h2>
            <p className="text-muted-foreground text-lg">
              무운 서비스에 대한 질문이나 피드백이 있으신가요?<br />
              언제든지 저희에게 연락주세요.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 space-y-3 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-bold text-white">이메일</h3>
                <p className="text-sm text-muted-foreground">ykwillow1@naver.com</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/10">
              <CardContent className="p-6 space-y-3 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-bold text-white">응답 시간</h3>
                <p className="text-sm text-muted-foreground">24시간 이내</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/10">
              <CardContent className="p-6 space-y-3 text-center">
                <MessageSquare className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-bold text-white">문의 유형</h3>
                <p className="text-sm text-muted-foreground">모든 문의 환영</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-white/10">
            <CardHeader className="border-b border-white/5 mb-6">
              <CardTitle className="text-2xl text-primary">문의 양식</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="이름을 입력하세요"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">제목 *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="문의 제목을 입력하세요"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">메시지 *</Label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="문의 내용을 입력하세요"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                >
                  문의 보내기
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  * 버튼을 누르면 메일 앱이 실행됩니다.
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-white text-lg">자주 묻는 질문</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-white mb-1">Q. 내 정보는 안전한가요?</p>
                  <p>A. 네, 모든 정보는 브라우저에서만 처리되며 서버에 저장되지 않습니다.</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Q. 결과를 저장할 수 있나요?</p>
                  <p>A. 결과 페이지에서 스크린샷을 촬영하거나 공유 기능을 이용할 수 있습니다.</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Q. 비용이 드나요?</p>
                  <p>A. 아니요, 모든 서비스는 완전히 무료입니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
