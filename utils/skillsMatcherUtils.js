const normalizeSkill = (skill) => {
    if (!skill || typeof skill !== 'string') return '';
    return skill.toLowerCase().trim().replace(/[^\w\s+#]/g, '').replace(/\s+/g, ' ');
};

const areSkillsSimilar = (skill1, skill2) => {
    const normalized1 = normalizeSkill(skill1);
    const normalized2 = normalizeSkill(skill2);
    if (normalized1 === normalized2) return true;
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
    return false;
};

const calculateJaccardSimilarity = (set1, set2) => {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
};

const extractSkills = (skillsInput) => {
    if (!skillsInput) return [];
    if (Array.isArray(skillsInput)) {
        return skillsInput
            .filter(skill => skill && typeof skill === 'string')
            .map(skill => normalizeSkill(skill))
            .filter(skill => skill.length > 0);
    }
    if (typeof skillsInput === 'string') {
        return skillsInput
            .split(/[,|;]/)
            .map(skill => normalizeSkill(skill))
            .filter(skill => skill.length > 0);
    }
    if (typeof skillsInput === 'object' && skillsInput.skills) {
        return extractSkills(skillsInput.skills);
    }
    return [];
};

const calculateSkillsMatch = (jobSkills, applicantSkills, options = {}) => {
    const { fuzzyMatch = true, caseSensitive = false } = options;
    const requiredSkills = extractSkills(jobSkills);
    const candidateSkills = extractSkills(applicantSkills);

    if (requiredSkills.length === 0) {
        return {
            matchPercentage: 100,
            matchedSkills: [],
            missingSkills: [],
            extraSkills: candidateSkills,
            totalRequired: 0,
            totalMatched: 0,
            message: 'No skills required for this position'
        };
    }

    if (candidateSkills.length === 0) {
        return {
            matchPercentage: 0,
            matchedSkills: [],
            missingSkills: requiredSkills,
            extraSkills: [],
            totalRequired: requiredSkills.length,
            totalMatched: 0,
            message: 'Applicant has no skills listed'
        };
    }

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(requiredSkill => {
        let found = false;
        for (const candidateSkill of candidateSkills) {
            if (fuzzyMatch) {
                if (areSkillsSimilar(requiredSkill, candidateSkill)) {
                    found = true;
                    matchedSkills.push({ required: requiredSkill, matched: candidateSkill });
                    break;
                }
            } else {
                const compareRequired = caseSensitive ? requiredSkill : requiredSkill.toLowerCase();
                const compareCandidate = caseSensitive ? candidateSkill : candidateSkill.toLowerCase();
                if (compareRequired === compareCandidate) {
                    found = true;
                    matchedSkills.push({ required: requiredSkill, matched: candidateSkill });
                    break;
                }
            }
        }
        if (!found) missingSkills.push(requiredSkill);
    });

    const matchedCandidateSkills = new Set(matchedSkills.map(m => m.matched));
    const extraSkills = candidateSkills.filter(skill => !matchedCandidateSkills.has(skill));
    const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

    let message = '';
    if (matchPercentage === 100) {
        message = 'Perfect match! Applicant has all required skills.';
    } else if (matchPercentage >= 80) {
        message = 'Excellent match! Applicant has most required skills.';
    } else if (matchPercentage >= 60) {
        message = 'Good match. Applicant has majority of required skills.';
    } else if (matchPercentage >= 40) {
        message = 'Moderate match. Applicant has some required skills.';
    } else if (matchPercentage >= 20) {
        message = 'Low match. Applicant has few required skills.';
    } else {
        message = 'Poor match. Applicant has minimal required skills.';
    }

    return {
        matchPercentage: Math.round(matchPercentage * 100) / 100,
        matchedSkills: matchedSkills.map(m => m.required),
        matchedPairs: matchedSkills,
        missingSkills,
        extraSkills,
        totalRequired: requiredSkills.length,
        totalMatched: matchedSkills.length,
        message
    };
};

const calculateWeightedSkillsMatch = (jobSkills, applicantSkills) => {
    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
        return calculateSkillsMatch(jobSkills, applicantSkills);
    }

    const candidateSkills = extractSkills(applicantSkills);
    let totalWeight = 0;
    let matchedWeight = 0;
    const matchedSkills = [];
    const missingSkills = [];

    jobSkills.forEach(({ skill, weight = 1 }) => {
        totalWeight += weight;
        const normalizedRequired = normalizeSkill(skill);
        let found = false;
        for (const candidateSkill of candidateSkills) {
            if (areSkillsSimilar(normalizedRequired, candidateSkill)) {
                found = true;
                matchedWeight += weight;
                matchedSkills.push({ skill: normalizedRequired, weight });
                break;
            }
        }
        if (!found) missingSkills.push({ skill: normalizedRequired, weight });
    });

    const matchPercentage = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

    return {
        matchPercentage: Math.round(matchPercentage * 100) / 100,
        matchedSkills: matchedSkills.map(m => m.skill),
        matchedSkillsWithWeight: matchedSkills,
        missingSkills: missingSkills.map(m => m.skill),
        missingSkillsWithWeight: missingSkills,
        totalWeight,
        matchedWeight,
        message: matchPercentage >= 70 ? 'Strong match' : matchPercentage >= 50 ? 'Moderate match' : 'Weak match'
    };
};

const rankApplicantsBySkills = (applicants, jobSkills, options = {}) => {
    if (!Array.isArray(applicants) || applicants.length === 0) return [];

    const rankedApplicants = applicants.map(applicant => {
        const skillsMatch = calculateSkillsMatch(
            jobSkills,
            applicant.skills || applicant.technicalSkills || [],
            options
        );
        return { ...applicant, skillsMatch };
    });

    return rankedApplicants.sort((a, b) =>
        b.skillsMatch.matchPercentage - a.skillsMatch.matchPercentage
    );
};

const getSkillRecommendations = (jobSkills, applicantSkills, targetPercentage = 80) => {
    const matchResult = calculateSkillsMatch(jobSkills, applicantSkills);

    if (matchResult.matchPercentage >= targetPercentage) {
        return {
            currentMatch: matchResult.matchPercentage,
            targetMatch: targetPercentage,
            achieved: true,
            recommendations: [],
            message: 'Target match percentage already achieved!'
        };
    }

    const skillsNeeded = Math.ceil(
        (targetPercentage / 100) * matchResult.totalRequired - matchResult.totalMatched
    );

    return {
        currentMatch: matchResult.matchPercentage,
        targetMatch: targetPercentage,
        achieved: false,
        skillsNeeded,
        recommendations: matchResult.missingSkills.slice(0, skillsNeeded),
        allMissingSkills: matchResult.missingSkills,
        message: `Learn ${skillsNeeded} more skill(s) to reach ${targetPercentage}% match`
    };
};

export {
    normalizeSkill,
    areSkillsSimilar,
    extractSkills,
    calculateSkillsMatch,
    calculateWeightedSkillsMatch,
    rankApplicantsBySkills,
    getSkillRecommendations,
    calculateJaccardSimilarity
};
