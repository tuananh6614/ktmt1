
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ChapterDetail = () => {
  const { courseId, chapterId } = useParams();
  const [videoProgress, setVideoProgress] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Giới thiệu về Điện tử cơ bản</h1>
            <Progress value={videoProgress} className="h-1" />
          </div>

          {/* Video Player Placeholder */}
          <Card className="aspect-video mb-8 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <h3 className="text-xl mb-2">Video Player</h3>
              <p className="text-gray-400">Video content will be displayed here</p>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Bài trước
            </Button>
            <Button className="flex items-center gap-2">
              Bài tiếp theo
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChapterDetail;
