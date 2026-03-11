import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CampaignResult {
  headline: string;
  text: string;
  description: string;
  image: string;
}

const Index = () => {
  const [idea, setIdea] = useState("");
  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);

  const handleGenerate = async () => {
    if (!idea || !goal || !style) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setResult(null);

    const body = JSON.stringify({ idea, goal, style });

    try {
      const res = await fetch("https://kaicella.app.n8n.cloud/webhook/ccc-ai-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) throw new Error("Request failed");

      const data: CampaignResult = await res.json();

      setResult(data);
    } catch {
      toast.error("Failed to generate campaign kit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadImage = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = "campaign-image";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[hsl(250,80%,60%)] to-[hsl(280,70%,55%)] bg-clip-text text-transparent">
              CCC AI
            </h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Creator Create Creation AI
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            AI tool for creators and marketers.
          </p>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Input Section */}
        <Card className="shadow-lg shadow-primary/5 border-border/50">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Campaign Idea
              </label>
              <Textarea
                placeholder="Example: Launch a new coffee brand using a viral Instagram campaign."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Campaign Goal
                </label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Traffic">Traffic</SelectItem>
                    <SelectItem value="Conversion">Conversion</SelectItem>
                    <SelectItem value="Daily Post">Daily Post</SelectItem>
                    <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                    <SelectItem value="Product Launch">Product Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Creative Style
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clean">Clean</SelectItem>
                    <SelectItem value="Meme">Meme</SelectItem>
                    <SelectItem value="UGC">UGC</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Viral">Viral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full text-base font-semibold rounded-xl"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              Generate Campaign Kit
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">
              CCC AI is generating your campaign kit...
            </p>
          </div>
        )}

        {/* Result Section */}
        {result && !loading && (
          <Card className="shadow-lg shadow-primary/5 border-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                {result.headline}
              </h2>

              {/* Post Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Post Text
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.text)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-foreground bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                  {result.text}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.description)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-foreground bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Image */}
              {result.image_url && (
                <div className="space-y-3">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Campaign Image
                  </span>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <img
                      src={result.image_url}
                      alt={result.headline}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadImage(result.image_url)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
