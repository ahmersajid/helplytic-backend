export const analyzeRequest = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();

    // Detect urgency
    let urgency = 'low';
    if (text.includes('urgent') || text.includes('asap') || text.includes('emergency') || text.includes('critical')) {
        urgency = 'high';
    } else if (text.includes('need soon') || text.includes('important')) {
        urgency = 'medium';
    }

    // Detect category and tags
    let category = 'General';
    const tags = [];

    const techKeywords = ['code', 'bug', 'error', 'react', 'node', 'database', 'api', 'server', 'frontend', 'backend'];
    const healthKeywords = ['health', 'pain', 'doctor', 'medical', 'sick', 'injury'];
    const designKeywords = ['ui', 'ux', 'design', 'figma', 'css', 'layout', 'color'];

    let techCount = 0;
    let healthCount = 0;
    let designCount = 0;

    techKeywords.forEach(kw => {
        if (text.includes(kw)) {
            techCount++;
            if (!tags.includes(kw)) tags.push(kw);
        }
    });

    healthKeywords.forEach(kw => {
        if (text.includes(kw)) {
            healthCount++;
            if (!tags.includes(kw)) tags.push(kw);
        }
    });

    designKeywords.forEach(kw => {
        if (text.includes(kw)) {
            designCount++;
            if (!tags.includes(kw)) tags.push(kw);
        }
    });

    if (techCount >= healthCount && techCount > 0) category = 'Technology';
    else if (healthCount > techCount) category = 'Health & Wellness';
    else if (designCount > 0) category = 'Design';

    return { urgency, category, tags };
};
