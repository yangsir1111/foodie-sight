import { useState, useEffect } from "react";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface HistoryRecord {
  id: number;
  image: string;
  result: {
    food: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: string;
}

const ProfilePage = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('calorieHistory') || '[]');
    setHistory(savedHistory);
  };

  const deleteRecord = (id: number) => {
    const updatedHistory = history.filter(record => record.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('calorieHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "删除成功",
      description: "历史记录已删除",
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('calorieHistory');
    
    toast({
      title: "清空成功",
      description: "所有历史记录已清空",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "刚刚";
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  return (
    <div className="pb-20 p-4 min-h-screen bg-background">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">我的记录</h1>
          <p className="text-muted-foreground">查看识别历史记录</p>
        </div>

        {history.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              共 {history.length} 条记录
            </span>
            <Button
              onClick={clearAllHistory}
              variant="destructive"
              size="sm"
            >
              清空全部
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="p-8 text-center bg-app-gradient-card shadow-app-card">
              <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <Clock size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">暂无记录</h3>
              <p className="text-muted-foreground text-sm">
                开始识别食物热量，记录将显示在这里
              </p>
            </Card>
          ) : (
            history.map((record) => (
              <Card key={record.id} className="p-4 bg-app-gradient-card shadow-app-card">
                <div className="flex gap-4">
                  <img
                    src={record.image}
                    alt={record.result.food}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-card-foreground line-clamp-2">
                        {record.result.food}
                      </h3>
                      <Button
                        onClick={() => deleteRecord(record.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-primary">
                        {record.result.calories} 卡路里
                      </span>
                      <span className="text-muted-foreground">
                        蛋白质 {record.result.protein}g
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>碳水 {record.result.carbs}g</span>
                      <span>脂肪 {record.result.fat}g</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDate(record.timestamp)}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;