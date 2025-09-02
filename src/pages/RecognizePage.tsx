import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FoodResult {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  suggestions: string[];
}

const RecognizePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // 模拟AI识别过程
    setTimeout(() => {
      const mockResult: FoodResult = {
        food: "烤三文鱼配蔬菜",
        calories: 520,
        protein: 38,
        carbs: 26,
        fat: 26,
        suggestions: [
          "这是一份营养均衡的餐食",
          "富含优质蛋白质和健康脂肪",
          "建议搭配全谷物主食更好"
        ]
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
      
      // 保存到历史记录
      const history = JSON.parse(localStorage.getItem('calorieHistory') || '[]');
      const newRecord = {
        id: Date.now(),
        image: selectedImage,
        result: mockResult,
        timestamp: new Date().toISOString()
      };
      history.unshift(newRecord);
      localStorage.setItem('calorieHistory', JSON.stringify(history));
      
      toast({
        title: "识别完成",
        description: "已添加到历史记录",
      });
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="pb-20 p-4 min-h-screen bg-background">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI热量识别</h1>
          <p className="text-muted-foreground">拍照或选择图片识别食物热量</p>
        </div>

        {!selectedImage ? (
          <Card className="p-8 text-center bg-app-gradient-card shadow-app-card">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera size={40} className="text-primary" />
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-app-gradient-primary text-primary-foreground shadow-app-float hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <Camera className="mr-2" size={20} />
                  拍照
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Upload className="mr-2" size={20} />
                  上传照片
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-4 bg-app-gradient-card shadow-app-card">
              <img
                src={selectedImage}
                alt="Selected food"
                className="w-full h-64 object-cover rounded-lg"
              />
            </Card>

            {!result ? (
              <div className="space-y-4">
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full bg-app-gradient-primary text-primary-foreground shadow-app-float"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      正在识别...
                    </>
                  ) : (
                    "开始识别"
                  )}
                </Button>
                
                <Button
                  onClick={resetAnalysis}
                  variant="outline"
                  className="w-full"
                >
                  重新选择
                </Button>
              </div>
            ) : (
              <Card className="p-6 bg-app-gradient-card shadow-app-card">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-card-foreground">{result.food}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.calories}</div>
                      <div className="text-sm text-muted-foreground">卡路里</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-card-foreground">蛋白质</span>
                        <span className="text-sm font-medium text-card-foreground">{result.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-card-foreground">碳水</span>
                        <span className="text-sm font-medium text-card-foreground">{result.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-card-foreground">脂肪</span>
                        <span className="text-sm font-medium text-card-foreground">{result.fat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-card-foreground">营养建议</h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="w-full"
                  >
                    继续识别
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default RecognizePage;