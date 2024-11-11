import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, SunMedium, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

const PRODUCTS = [
  {
    title: "Philips Hue White and Color",
    description:
      "Premium smart bulbs with rich colors and seamless integration",
    price: "$45/bulb",
    link: "https://amazon.com/...",
    tags: ["Matter", "HomeKit", "Zigbee", "Premium"],
    matchScore: {
      smartHome: ["advanced"],
      network: ["mesh", "partial"],
      features: ["full"],
      control: ["voice", "app"],
      budget: ["premium"],
    },
  },
  {
    title: "Lutron Caseta Dimmer",
    description:
      "Professional-grade switch replacement with reliable performance",
    price: "$52",
    link: "https://amazon.com/...",
    tags: ["Switch", "No-neutral", "Premium"],
    matchScore: {
      smartHome: ["basic", "advanced"],
      network: ["weak", "none"],
      features: ["dim"],
      control: ["app", "switch"],
      budget: ["premium"],
    },
  },
  {
    title: "Philips WiZ A19",
    description: "Affordable smart bulbs with local API control",
    price: "$15/bulb",
    link: "https://amazon.com/...",
    tags: ["WiFi", "Budget", "Local API"],
    matchScore: {
      smartHome: ["basic", "advanced"],
      network: ["mesh", "partial"],
      features: ["full", "temp"],
      control: ["voice", "app"],
      budget: ["budget"],
    },
  },
];

const LightingAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: "smartHome",
      text: "Do you want smart home integration?",
      options: [
        { value: "advanced", label: "Yes - Advanced (Home Assistant/Matter)" },
        { value: "basic", label: "Yes - Basic (WiFi/App Control)" },
        { value: "none", label: "No - Traditional lighting is fine" },
      ],
    },
    {
      id: "network",
      text: "How's your network setup?",
      options: [
        { value: "mesh", label: "Strong mesh WiFi everywhere" },
        { value: "partial", label: "Good in most areas" },
        { value: "weak", label: "Spotty/Unreliable" },
        { value: "none", label: "Prefer network-independent" },
      ],
    },
    {
      id: "features",
      text: "What lighting features matter most?",
      options: [
        { value: "full", label: "Everything (Color, Temperature, Dimming)" },
        { value: "temp", label: "White Temperature + Dimming" },
        { value: "dim", label: "Just Dimming" },
        { value: "basic", label: "Basic On/Off is fine" },
      ],
    },
    {
      id: "control",
      text: "How do you want to control your lights?",
      options: [
        { value: "voice", label: "Voice + App + Switch" },
        { value: "app", label: "App + Switch" },
        { value: "switch", label: "Smart Switch Only" },
        { value: "traditional", label: "Traditional Switch" },
      ],
    },
    {
      id: "budget",
      text: "What's your budget per light?",
      options: [
        { value: "premium", label: "$40+ (Premium)" },
        { value: "midrange", label: "$20-40 (Mid-range)" },
        { value: "budget", label: "$10-20 (Budget)" },
        { value: "basic", label: "Under $10 (Basic)" },
      ],
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(newAnswers);
    setCurrentStep(currentStep + 1);
  };

  const getRecommendations = () => {
    const scoredProducts = PRODUCTS.map((product) => {
      let score = 0;
      Object.entries(answers).forEach(([questionId, answer]) => {
        if (
          product.matchScore[
            questionId as keyof typeof product.matchScore
          ]?.includes(answer as string)
        ) {
          score += 1;
        }
      });
      return { ...product, score };
    });

    return scoredProducts
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Smart Lighting Advisor</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFlowchart(!showFlowchart)}
            >
              {showFlowchart ? <ZoomIn /> : <ZoomOut />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <SunMedium /> : <Moon />}
            </Button>
          </div>
        </div>

        {showFlowchart ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="w-full overflow-auto text-center">
                <p className="mb-4">
                  Showing decision flowchart (separate Mermaid diagram artifact)
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowFlowchart(false)}
                >
                  Return to Questionnaire
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6">
              {currentStep < questions.length ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">
                    {questions[currentStep].text}
                  </h2>
                  <div className="grid gap-4">
                    {questions[currentStep].options.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="w-full justify-start text-left"
                        onClick={() => handleAnswer(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    Your Personalized Lighting Recommendations
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {getRecommendations().map((rec, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">
                            {rec.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {rec.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {rec.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full px-2 py-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="font-bold text-lg mb-4">{rec.price}</p>
                          <Button className="w-full">View on Amazon</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setCurrentStep(0);
                      setAnswers({});
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep < questions.length && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / questions.length) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightingAdvisor;
