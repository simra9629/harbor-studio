import { ProjectLevel, ProjectScore, SatisfactionTier } from './types';

export function evaluateSubmission(html: string, level: ProjectLevel): ProjectScore {
  // ===== PRECISION =====
  let precision = 100;
  const requiredReqs = level.requirements.filter(r => r.type === 'required');
  const bonusReqs = level.requirements.filter(r => r.type === 'bonus');
  
  let requiredPassed = 0;
  for (const req of requiredReqs) {
    if (!req.check(html)) {
      precision -= Math.floor(30 / requiredReqs.length);
    } else {
      requiredPassed++;
    }
  }
  
  // Check for missing closing tags
  const openTags = (html.match(/<(div|p|h[1-6]|ul|ol|li|section|article|header|footer|nav|table|tr|td|th|thead|tbody|span|em|strong|a|figure|figcaption|main)[\s>]/gi) || []);
  const closeTags = (html.match(/<\/(div|p|h[1-6]|ul|ol|li|section|article|header|footer|nav|table|tr|td|th|thead|tbody|span|em|strong|a|figure|figcaption|main)>/gi) || []);
  if (openTags.length > 0 && openTags.length !== closeTags.length) {
    precision -= 15;
  }
  
  // Check for missing alt on img
  const imgs = html.match(/<img[^>]*>/gi) || [];
  for (const img of imgs) {
    if (!/alt\s*=/i.test(img)) {
      precision -= 5;
    }
  }
  
  precision = Math.max(0, Math.min(100, precision));
  
  // ===== CREATIVITY =====
  let creativity = 50;
  
  for (const req of bonusReqs) {
    if (req.check(html)) {
      creativity += 12;
    }
  }
  
  // Extra elements beyond requirements
  const uniqueTags = new Set((html.match(/<([a-z][a-z0-9]*)/gi) || []).map(t => t.slice(1).toLowerCase()));
  if (uniqueTags.size > 8) creativity += 10;
  if (uniqueTags.size > 12) creativity += 5;
  
  // Styling signals
  if (/background/i.test(html)) creativity += 5;
  if (/color:/i.test(html)) creativity += 5;
  if (/font/i.test(html)) creativity += 3;
  if (/gradient/i.test(html)) creativity += 5;
  if (/box-shadow/i.test(html)) creativity += 3;
  if (/border-radius/i.test(html)) creativity += 3;
  
  // Penalize clutter
  const lineCount = html.split('\n').length;
  if (lineCount > 200) creativity -= 10;
  
  creativity = Math.max(0, Math.min(100, creativity));
  
  // ===== PROFESSIONALISM =====
  let professionalism = 100;
  
  // Inline CSS spam
  const inlineStyles = (html.match(/style\s*=\s*"/gi) || []).length;
  if (inlineStyles > 5) professionalism -= 25;
  else if (inlineStyles > 2) professionalism -= 10;
  
  // Has style block (good)
  if (/<style[\s>]/i.test(html)) professionalism += 10;
  
  // Semantic tags (good)
  if (/<(section|article|header|footer|nav|main)[\s>]/i.test(html)) professionalism += 10;
  
  // Consistent structure
  const indented = (html.match(/^\s{2,}</gm) || []).length;
  if (indented > 5) professionalism += 5;
  
  // Redundant styles penalty
  const styleMatches = html.match(/color:\s*([^;]+)/gi) || [];
  const uniqueColors = new Set(styleMatches.map(s => s.toLowerCase()));
  if (styleMatches.length > uniqueColors.size * 2) professionalism -= 10;
  
  professionalism = Math.max(0, Math.min(100, professionalism));
  
  // ===== SATISFACTION TIER =====
  const allRequiredPassed = requiredPassed === requiredReqs.length;
  const avg = (precision + creativity + professionalism) / 3;
  
  let tier: SatisfactionTier;
  if (!allRequiredPassed || avg < 50) {
    tier = 'needs_revision';
  } else if (avg < 65) {
    tier = 'acceptable';
  } else if (avg < 85) {
    tier = 'great_work';
  } else {
    tier = 'outstanding';
  }
  
  return { precision, creativity, professionalism, tier };
}

export function getFeedbackMessage(score: ProjectScore, level: ProjectLevel): string {
  if (score.tier === 'outstanding' || score.tier === 'great_work') {
    return level.feedbackHigh;
  } else if (score.tier === 'acceptable') {
    return level.feedbackMid;
  }
  return level.feedbackLow;
}

export function getTierLabel(tier: SatisfactionTier): string {
  switch (tier) {
    case 'needs_revision': return '🔄 Needs Revision';
    case 'acceptable': return '👍 Acceptable';
    case 'great_work': return '⭐ Great Work';
    case 'outstanding': return '🏆 Outstanding';
  }
}

export function getTierColor(tier: SatisfactionTier): string {
  switch (tier) {
    case 'needs_revision': return 'hsl(var(--destructive))';
    case 'acceptable': return 'hsl(var(--harbor-sand))';
    case 'great_work': return 'hsl(var(--harbor-ocean))';
    case 'outstanding': return 'hsl(var(--harbor-gold))';
  }
}
