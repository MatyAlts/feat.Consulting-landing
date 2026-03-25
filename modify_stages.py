import re

with open("g:/Proyectos/feat.Consulting-landing/src/components/mobile/DecisionStages.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import and FadeInRow component at the top
if 'import { motion }' not in content:
    content = content.replace('import { useEffect } from "react";', 'import { useEffect } from "react";\nimport { motion } from "framer-motion";\n\nfunction FadeInRow({ children, className = "" }: { children: React.ReactNode, className?: string }) {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 15 }}\n      whileInView={{ opacity: 1, y: 0 }}\n      viewport={{ once: true, amount: 0.2 }}\n      transition={{ duration: 0.5, ease: "easeOut" }}\n      className={className}\n    >\n      {children}\n    </motion.div>\n  );\n}\n')

# 2. Add FadeInRow Wrappers in Stage 1, 2, 3

# Wait, the python regex approach:
# Stage headers (span and h3)
content = re.sub(r'(<span[^>]*>\s*Step \d\s*—[^<]*</span>)', r'<FadeInRow>\1</FadeInRow>', content)
content = re.sub(r'(<h3[^>]*>[\s\S]*?</h3>)', r'<FadeInRow>\1</FadeInRow>', content)

# Narrative p's (the first italic lines)
content = re.sub(r'(<p[^>]*>\s*(Where should growth actually focus|Does the market confirm this direction|How do we turn that signal into repeatable growth)\?[\s\S]*?</p>)', r'<FadeInRow>\1</FadeInRow>', content)

# Subsequent narrative divs
content = re.sub(r'(<div[^>]*>\s*<p style={{ fontWeight: 300 }}[\s\S]*?</div>)', r'<FadeInRow>\1</FadeInRow>', content)

# Dark wrapper internal lines
# We want to wrap the first 'The real question is:' or 'Depending on where...' p
content = re.sub(r'(<p\s+style={{[\s\S]*?color: "#FFFFFF",[\s\S]*?}}>[\s\S]*?</p>)', r'<FadeInRow>\1</FadeInRow>', content)

# Wrap lists inside dark wrappers
content = re.sub(r'(<p[^>]*>\s*What decision should the business help its audience make\?[\s\S]*?</p>)', r'<FadeInRow>\1</FadeInRow>', content)
content = re.sub(r'(<div className="flex gap-2"><span className="shrink-0 mt-\[2px\]">•</span>.*?</div>)', r'<FadeInRow>\1</FadeInRow>', content)

# Output lines
content = re.sub(r'(<p style={{ fontWeight: 700, lineHeight: "1.1", marginBottom: "7px" }}>Output</p>)', r'<FadeInRow>\1</FadeInRow>', content)
content = re.sub(r'(<div className="flex gap-2">\s*<span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>[\s\S]*?</div>)', r'<FadeInRow>\1</FadeInRow>', content)

# Images
content = re.sub(r'(<div className="w-full mt-4 flex justify-center items-center">[\s\S]*?</div>)', r'<FadeInRow>\1</FadeInRow>', content)

with open("g:/Proyectos/feat.Consulting-landing/src/components/mobile/DecisionStages.tsx", "w", encoding="utf-8") as f:
    f.write(content)

