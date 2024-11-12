import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Clock,
  Cloud,
  Code,
  Copy,
  Database,
  ExternalLink,
  GitCommit,
  Key,
  Layout,
  Package,
  Palette,
  Search,
  Server,
  Shield,
  Sigma,
  Star,
  Terminal,
  TestTube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";

const categoryIcons: Record<string, JSX.Element> = {
  runtime: <Terminal className="w-4 h-4" />,
  linter: <Code className="w-4 h-4" />,
  bundler: <Package className="w-4 h-4" />,
  orm: <Database className="w-4 h-4" />,
  backend: <Server className="w-4 h-4" />,
  frontend: <Layout className="w-4 h-4" />,
  uilibrary: <Palette className="w-4 h-4" />,
  auth: <Key className="w-4 h-4" />,
  validation: <Shield className="w-4 h-4" />,
  statemgmt: <Activity className="w-4 h-4" />,
  testing: <TestTube className="w-4 h-4" />,
  deployment: <Cloud className="w-4 h-4" />,
  database: <Sigma className="w-4 h-4" />,
};

// Stack options and theme definitions as before...
const jsStackOptions = {
  runtime: ["Node.js", "Deno", "Bun"],
  linter: ["ESLint", "Biome", "Prettier", "StandardJS", "XO", "Rome"],
  bundler: [
    "Vite",
    "Webpack",
    "Turbopack",
    "Rollup",
    "esbuild",
    "Parcel",
    "SWC",
    "tsup",
  ],
  orm: [
    "Prisma",
    "TypeORM",
    "Sequelize",
    "Mongoose",
    "Drizzle",
    "Knex",
    "MikroORM",
  ],
  backend: [
    "Express",
    "NestJS",
    "Fastify",
    "Koa",
    "Hono",
    "Elysia",
    "tRPC",
    "GraphQL",
  ],
  frontend: [
    "React",
    "Vue",
    "Angular",
    "Svelte",
    "Solid",
    "Next.js",
    "Nuxt",
    "Remix",
    "Astro",
    "Qwik",
  ],
  uilibrary: [
    "Tailwind",
    "MUI",
    "Chakra UI",
    "Mantine",
    "shadcn/ui",
    "DaisyUI",
    "Radix UI",
    "HeadlessUI",
    "Framer Motion",
  ],
  auth: [
    "NextAuth",
    "Auth.js",
    "Passport",
    "Firebase Auth",
    "Supabase Auth",
    "Clerk",
    "Lucia",
    "Kinde",
  ],
  validation: [
    "Zod",
    "Yup",
    "Joi",
    "class-validator",
    "Valibot",
    "ValidateJS",
    "Superstruct",
  ],
  statemgmt: [
    "Redux",
    "Zustand",
    "Jotai",
    "XState",
    "MobX",
    "Recoil",
    "TanStack Query",
    "Valtio",
    "Nanostores",
  ],
  testing: [
    "Jest",
    "Vitest",
    "Cypress",
    "Playwright",
    "RTL",
    "MSW",
    "Testing Library",
    "Storybook",
  ],
  deployment: [
    "Vercel",
    "Netlify",
    "Railway",
    "Fly.io",
    "AWS",
    "GCP",
    "DigitalOcean",
    "Cloudflare",
  ],
  database: [
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "SQLite",
    "Supabase",
    "PlanetScale",
    "CockroachDB",
  ],
};

const pythonStackOptions = {
  runtime: ["Python 3.12", "Python 3.11", "Python 3.10", "PyPy"],
  linter: ["Pylint", "Ruff", "Flake8", "Black", "isort", "Mypy", "Bandit"],
  bundler: [
    "Poetry",
    "setuptools",
    "pip-tools",
    "Hatch",
    "PDM",
    "Maturin",
    "Flit",
  ],
  orm: [
    "SQLAlchemy",
    "Django ORM",
    "Peewee",
    "Tortoise-ORM",
    "Pony ORM",
    "SQLModel",
    "Piccolo",
  ],
  backend: [
    "FastAPI",
    "Django",
    "Flask",
    "Starlette",
    "aiohttp",
    "Pyramid",
    "Sanic",
    "Litestar",
  ],
  frontend: [
    "Django Templates",
    "Jinja2",
    "HTMX",
    "Alpine.js",
    "Streamlit",
    "Dash",
    "Panel",
    "Gradio",
  ],
  uilibrary: [
    "TailwindCSS",
    "Bootstrap",
    "Bulma",
    "DaisyUI",
    "PyWebIO",
    "Nicegui",
    "Flet",
    "Reflex",
  ],
  auth: [
    "Django Auth",
    "FastAPI Users",
    "Authlib",
    "Python-JOSE",
    "PyJWT",
    "Starlette Auth",
    "Guardian",
  ],
  validation: [
    "Pydantic",
    "Marshmallow",
    "Django Validators",
    "Cerberus",
    "WTForms",
    "Schematics",
    "voluptuous",
  ],
  statemgmt: [
    "Django Signals",
    "SQLAlchemy Events",
    "RxPY",
    "PyPubSub",
    "Strawberry GraphQL",
    "FastAPI DEP",
    "Redis PubSub",
  ],
  testing: [
    "Pytest",
    "Unittest",
    "Hypothesis",
    "Robot Framework",
    "Behave",
    "Locust",
    "Selenium",
    "Playwright",
  ],
  deployment: [
    "Gunicorn",
    "Uvicorn",
    "Docker",
    "AWS Lambda",
    "Google Cloud Run",
    "Heroku",
    "DigitalOcean App Platform",
  ],
  database: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Cassandra",
    "TimescaleDB",
    "InfluxDB",
  ],
};

const timePeriodOptions = [
  { label: "Last week", value: "7" },
  { label: "Last month", value: "30" },
  { label: "Last 3 months", value: "90" },
  { label: "Last 6 months", value: "180" },
  { label: "Last year", value: "365" },
];
interface QuickSearchResult {
  category: string;
  option: string;
}
export const GithubParam = () => {
  const [isPython, setIsPython] = useState(false);
  const [selectedStack, setSelectedStack] = useState<Record<string, string>>(
    {}
  );
  const [quickSearch, setQuickSearch] = useState("");
  const [quickSearchResults, setQuickSearchResults] = useState<
    QuickSearchResult[]
  >([]);
  const [searchUrl, setSearchUrl] = useState("");
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [globalFilters, setGlobalFilters] = useState({
    stars: "",
    commits: "",
    updatedWithin: "",
  });

  const stackOptions = isPython ? pythonStackOptions : jsStackOptions;
  const getThemeClasses = () => ({
    card: isPython
      ? "bg-gradient-to-br from-emerald-950 to-black border-emerald-700"
      : "bg-gradient-to-br from-purple-950 to-black border-purple-700",
    header: isPython ? "border-emerald-800/30" : "border-purple-800/30",
    title: isPython
      ? "from-emerald-400 to-purple-400"
      : "from-purple-400 to-teal-400",
    input: isPython
      ? "bg-emerald-950/50 border-emerald-700/50 text-emerald-100 placeholder:text-emerald-400"
      : "bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400",
    select: isPython
      ? "bg-emerald-950/50 border-emerald-700/50 text-emerald-100"
      : "bg-purple-950/50 border-purple-700/50 text-purple-100",
    selectContent: isPython
      ? "bg-emerald-900 border-emerald-700"
      : "bg-purple-900 border-purple-700",
    selectItem: isPython
      ? "text-emerald-100 hover:bg-emerald-800"
      : "text-purple-100 hover:bg-purple-800",
    badge: isPython
      ? "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
      : "bg-purple-800/50 text-purple-200 hover:bg-purple-700/50",
    badgeContainer: isPython
      ? "bg-emerald-950/30 border-emerald-800/30"
      : "bg-purple-950/30 border-purple-800/30",
    urlContainer: isPython
      ? "bg-emerald-950/50 border-emerald-700/50 text-emerald-200"
      : "bg-purple-950/50 border-purple-700/50 text-purple-200",
    button: isPython
      ? "border-emerald-700 hover:bg-emerald-800/50 text-emerald-200"
      : "border-purple-700 hover:bg-purple-800/50 text-purple-200",
    label: isPython ? "text-emerald-300" : "text-purple-300",
    icon: isPython ? "text-emerald-400" : "text-purple-400",
    activeButton: isPython
      ? "bg-emerald-700 text-emerald-100"
      : "bg-purple-700 text-purple-100",
    inactiveButton: isPython
      ? "bg-transparent text-emerald-300"
      : "bg-transparent text-purple-300",
  });
  const quickSearchRef = useRef(null);

  useEffect(() => {
    if (quickSearch) {
      const normalizedSearch = quickSearch.toLowerCase().replace(/[\s.]+/g, "");
      const results = Object.entries(stackOptions).flatMap(
        ([category, options]) =>
          options
            .filter((option) =>
              option
                .toLowerCase()
                .replace(/[\s.]+/g, "")
                .includes(normalizedSearch)
            )
            .map((option) => ({ category, option }))
      );
      setQuickSearchResults(results);
      setIsQuickSearchOpen(true);
    } else {
      setQuickSearchResults([]);
      setIsQuickSearchOpen(false);
    }
  }, [quickSearch, stackOptions]);

  useEffect(() => {
    // Reset selected stack when switching ecosystems
    setSelectedStack({});
  }, [isPython]);

  useEffect(() => {
    const baseUrl = new URL(
      "https://github.com/search?type=Repositories&utf8=%E2%9C%93&fork=true&archived=false&"
    );
    let queryString = "";

    // Add global filters
    if (globalFilters.stars) {
      queryString += `stars:>=${globalFilters.stars} `;
    }
    if (globalFilters.commits) {
      //   queryString += `commits:>=${globalFilters.commits} `;
    }
    if (globalFilters.updatedWithin) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(globalFilters.updatedWithin));
      const formattedDate = date.toISOString().split("T")[0];
      queryString += `pushed:>=${formattedDate} `;
    }

    // Add stack selections
    Object.values(selectedStack).forEach((value) => {
      if (value) {
        queryString += `${value.toLowerCase()} in:readme ${value.toLowerCase()} in:description ${value.toLowerCase()} in:name `;
      }
    });

    if (queryString) {
      baseUrl.searchParams.set("q", queryString.trim());
    }

    setSearchUrl(baseUrl.toString());
  }, [selectedStack, globalFilters]);

  useEffect(() => {
    if (quickSearch) {
      const normalizedSearch = quickSearch.toLowerCase().replace(/[\s.]+/g, "");
      const results = Object.entries(stackOptions).flatMap(
        ([category, options]) =>
          options
            .filter((option) =>
              option
                .toLowerCase()
                .replace(/[\s.]+/g, "")
                .includes(normalizedSearch)
            )
            .map((option) => ({ category, option }))
      );
      setQuickSearchResults(results);
      setIsQuickSearchOpen(results.length > 0); // Only open if matches exist
    } else {
      setQuickSearchResults([]);
      setIsQuickSearchOpen(false);
    }
  }, [quickSearch, stackOptions]);

  const handleQuickSearchSelect = (result: QuickSearchResult) => {
    setSelectedStack((prev) => ({
      ...prev,
      [result.category]: result.option,
    }));
    setQuickSearch("");
    setIsQuickSearchOpen(false);
  };

  const theme = getThemeClasses();
  const handleQuickSearchKeyDown = (event: { key: string }) => {
    if (event.key === "Enter" && quickSearchResults.length > 0) {
      handleQuickSearchSelect(quickSearchResults[0]);
    }
  };
  return (
    <Card className={`w-full max-w-4xl ${theme.card}`}>
      <CardHeader className={`border-b ${theme.header}`}>
        <div className="flex items-center justify-between ">
          <CardTitle>
            <Label
              className={`data-darkreader-skip bg-clip-text text-transparent !important text-2xl font-bold bg-gradient-to-r ${theme.title} `}
            >
              GitHub Stack Search Helper
            </Label>
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant={isPython ? "outline" : "default"}
              onClick={() => setIsPython(false)}
              className={!isPython ? theme.activeButton : theme.inactiveButton}
            >
              JavaScript
            </Button>
            <Button
              variant={isPython ? "default" : "outline"}
              onClick={() => setIsPython(true)}
              className={isPython ? theme.activeButton : theme.inactiveButton}
            >
              Python
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Global Filters */}
        <div className="grid grid-cols-4 gap-4 p-4 rounded-md border bg-black/20">
          <div className="space-y-2">
            <label
              className={`text-sm font-medium ${theme.label} flex items-center gap-2`}
            >
              <Star className="w-4 h-4" /> Min Stars
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 100"
              value={globalFilters.stars}
              onChange={(e) =>
                setGlobalFilters((prev) => ({ ...prev, stars: e.target.value }))
              }
              className={theme.input}
            />
          </div>
          <div className="space-y-2">
            <label
              className={`text-sm font-medium ${theme.label} flex items-center gap-2`}
            >
              <GitCommit className="w-4 h-4" /> Min Commits
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={globalFilters.commits}
              onChange={(e) =>
                setGlobalFilters((prev) => ({
                  ...prev,
                  commits: e.target.value,
                }))
              }
              className={theme.input}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label
              className={`text-sm font-medium ${theme.label} flex items-center gap-2`}
            >
              <Clock className="w-4 h-4" /> Updated Within
            </label>
            <Select
              value={globalFilters.updatedWithin}
              onValueChange={(value) =>
                setGlobalFilters((prev) => ({ ...prev, updatedWithin: value }))
              }
            >
              <SelectTrigger className={theme.select}>
                <SelectValue placeholder="Select time period..." />
              </SelectTrigger>
              <SelectContent className={theme.selectContent}>
                {timePeriodOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={theme.selectItem}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative flex gap-4 items-center">
          <Input
            ref={quickSearchRef}
            placeholder="Quick search stack..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyDown={handleQuickSearchKeyDown}
            className={theme.input}
          />
          <Search className={`w-5 h-5 ${theme.icon}`} />

          {/* Results Dropdown */}
          {isQuickSearchOpen && quickSearchResults.length > 0 && (
            <div
              className={`absolute top-full mt-1 w-full max-h-48 overflow-y-auto bg-black rounded-md border shadow-lg ${theme.selectContent}`}
            >
              {quickSearchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickSearchSelect(result)}
                  className={`p-2 cursor-pointer hover:bg-gray-700 ${theme.selectItem}`}
                >
                  <div className="flex items-center gap-2">
                    {categoryIcons[result.category]}
                    <span>{result.option}</span>
                    <span className={`ml-2 text-xs ${theme.label}`}>
                      ({result.category})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stackOptions).map(([category, options]) => (
            <div key={category} className="space-y-2">
              <label
                className={`text-sm font-medium capitalize ${theme.label} flex items-center gap-2`}
              >
                {categoryIcons[category]} {category}
              </label>
              <Select
                value={selectedStack[category] || ""}
                onValueChange={(value) =>
                  setSelectedStack((prev) => ({ ...prev, [category]: value }))
                }
              >
                <SelectTrigger className={theme.select}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className={theme.selectContent}>
                  {options.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className={theme.selectItem}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Selected Stack Display */}
        <div
          className={`flex flex-wrap gap-2 min-h-12 p-4 rounded-md border ${theme.badgeContainer}`}
        >
          {Object.entries(selectedStack).map(([category, value]) =>
            value ? (
              <Badge
                key={`${category}-${value}`}
                variant="secondary"
                className={theme.badge}
                onClick={() =>
                  setSelectedStack((prev) => {
                    const next = { ...prev };
                    delete next[category];
                    return next;
                  })
                }
              >
                {categoryIcons[category]} {value} ×
              </Badge>
            ) : null
          )}
        </div>

        {/* URL Display and Actions */}
        <div className="flex items-center gap-4 p-4 w-full max-w-full">
          <div
            className={`w-full max-w-full flex-1 relative p-3 rounded-md border font-mono text-sm ${theme.urlContainer}`}
          >
            <div className="pr-20 whitespace-nowrap w-full max-w-full">
              <div className="flex-1 truncate pr-20">{searchUrl}</div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={theme.button}
                onClick={() => {
                  navigator.clipboard.writeText(searchUrl);
                  // Could add toast notification here
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={theme.button}
                onClick={() => window.open(searchUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
