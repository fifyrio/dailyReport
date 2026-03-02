import { Category } from '@/types';

const KEYWORDS: Record<Category, string[]> = {
  app_dev: [
    'app', 'application', '应用', '代码', 'code', '编程', '开发', 'dev',
    'flutter', 'dart', 'react', 'next', 'web', 'ios', 'android', 'debug',
    'feature', '功能', 'bug', '修复', 'ui', 'ux', '界面', 'api', '后端',
    'frontend', '部署', 'deploy', '测试', 'test', '重构', 'refactor'
  ],
  tiktok: [
    'tiktok', '抖音', '视频', 'video', '拍摄', '剪辑', '编辑', '脚本',
    'content', '脚本', '脚本', '素材', '上传', '发布', '流量', '播放量',
    'view', 'likes', '粉丝', 'follower', 'trend', '热门', '标题', 'thumbnail'
  ],
  growth: [
    'growth', '成长', '学习', 'learn', '书', 'book', '阅读', 'read',
    '写作', 'write', '自媒体', 'personal brand', '课程', 'course', '教程',
    '思考', '反思', '总结', '笔记', 'note', '输入', '输出', '习惯', 'habit'
  ],
};

export function classifyText(text: string): Category {
  const lowerText = text.toLowerCase();
  
  // Score each category
  const scores: Record<Category, number> = {
    app_dev: 0,
    tiktok: 0,
    growth: 0,
  };
  
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        scores[category as Category]++;
      }
    }
  }
  
  // Find max score
  let maxCategory: Category = 'growth';
  let maxScore = -1;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category as Category;
    }
  }
  
  // If no keywords matched, default to growth
  if (maxScore === 0) {
    return 'growth';
  }
  
  return maxCategory;
}
