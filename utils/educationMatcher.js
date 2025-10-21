const DEGREE_HIERARCHY = {
  highschool: 1,
  diploma: 2,
  bachelor: 3,
  master: 4,
  phd: 5,
};

const TIER1_INSTITUTIONS = [
  "IIT",
  "Indian Institute of Technology",
  "IIM",
  "Indian Institute of Management",
  "BITS Pilani",
  "MIT",
  "Stanford",
  "Harvard",
  "Oxford",
  "Cambridge",
  "NIT",
  "IIIT",
];

const IIT_KEYWORDS = ["IIT", "Indian Institute of Technology"];
const NIT_KEYWORDS = ["NIT", "National Institute of Technology"];
const IIIT_KEYWORDS = ["IIIT", "Indian Institute of Information Technology"];

export const matchesEducationPreferences = (jobEducationPrefs, candidateEducation) => {
  if (!jobEducationPrefs || !candidateEducation || candidateEducation.length === 0) {
    return { matches: true, score: 50, reasons: [] };
  }

  let score = 0;
  const reasons = [];
  const maxScore = 100;

  const highestDegree = getHighestDegree(candidateEducation);
  const degreeScore = checkDegreeRequirement(jobEducationPrefs.minimumDegree, highestDegree);

  if (degreeScore.matches) {
    score += 30;
    reasons.push(degreeScore.reason);
  } else if (jobEducationPrefs.isStrict) {
    return { matches: false, score: 0, reasons: [degreeScore.reason] };
  }

  const institutionScore = checkInstitutionPreference(jobEducationPrefs, candidateEducation);

  if (institutionScore.matches) {
    score += 40;
    reasons.push(institutionScore.reason);
  } else if (jobEducationPrefs.isStrict && jobEducationPrefs.preferredInstitutions.length > 0) {
    return { matches: false, score, reasons: [institutionScore.reason] };
  }

  const fieldScore = checkFieldOfStudy(jobEducationPrefs.preferredFieldsOfStudy, candidateEducation);

  if (fieldScore.matches) {
    score += 30;
    reasons.push(fieldScore.reason);
  } else if (jobEducationPrefs.isStrict && jobEducationPrefs.preferredFieldsOfStudy.length > 0) {
    return { matches: false, score, reasons: [fieldScore.reason] };
  }

  const finalMatches = score >= 50 || !jobEducationPrefs.isStrict;

  return {
    matches: finalMatches,
    score: Math.min(score, maxScore),
    reasons,
  };
};

const getHighestDegree = (educationArray) => {
  let highest = "highschool";
  let highestValue = 0;

  educationArray.forEach((edu) => {
    const degreeValue = DEGREE_HIERARCHY[edu.degree?.toLowerCase()] || 0;
    if (degreeValue > highestValue) {
      highestValue = degreeValue;
      highest = edu.degree?.toLowerCase();
    }
  });

  return highest;
};

const checkDegreeRequirement = (requiredDegree, candidateDegree) => {
  const requiredLevel = DEGREE_HIERARCHY[requiredDegree?.toLowerCase()] || 3;
  const candidateLevel = DEGREE_HIERARCHY[candidateDegree?.toLowerCase()] || 0;

  if (candidateLevel >= requiredLevel) {
    return {
      matches: true,
      reason: `Candidate has ${candidateDegree} (meets minimum ${requiredDegree} requirement)`,
    };
  }

  return {
    matches: false,
    reason: `Candidate has ${candidateDegree} (requires minimum ${requiredDegree})`,
  };
};

const checkInstitutionPreference = (jobEducationPrefs, candidateEducation) => {
  const { institutionType, preferredInstitutions } = jobEducationPrefs;

  if (!institutionType || institutionType === "any") {
    return { matches: true, reason: "No specific institution preference" };
  }

  for (const edu of candidateEducation) {
    const institution = edu.institution || "";

    if (preferredInstitutions.length > 0) {
      const matchesPreferred = preferredInstitutions.some((preferred) =>
        institution.toLowerCase().includes(preferred.toLowerCase())
      );
      if (matchesPreferred) {
        return {
          matches: true,
          reason: `Graduate from preferred institution: ${institution}`,
        };
      }
    }

    if (institutionType === "iit" && matchesKeywords(institution, IIT_KEYWORDS)) {
      return { matches: true, reason: `IIT graduate: ${institution}` };
    }

    if (institutionType === "nit" && matchesKeywords(institution, NIT_KEYWORDS)) {
      return { matches: true, reason: `NIT graduate: ${institution}` };
    }

    if (institutionType === "iiit" && matchesKeywords(institution, IIIT_KEYWORDS)) {
      return { matches: true, reason: `IIIT graduate: ${institution}` };
    }

    if (institutionType === "tier1" && isTier1Institution(institution)) {
      return { matches: true, reason: `Tier-1 institution graduate: ${institution}` };
    }
  }

  if (preferredInstitutions.length > 0) {
    return {
      matches: false,
      reason: `Does not match preferred institutions: ${preferredInstitutions.join(", ")}`,
    };
  }

  return {
    matches: false,
    reason: `Does not match institution type: ${institutionType}`,
  };
};

const checkFieldOfStudy = (preferredFields, candidateEducation) => {
  if (!preferredFields || preferredFields.length === 0) {
    return { matches: true, reason: "No specific field of study preference" };
  }

  for (const edu of candidateEducation) {
    const field = edu.fieldOfStudy || "";
    const matchesField = preferredFields.some(
      (preferred) =>
        field.toLowerCase().includes(preferred.toLowerCase()) ||
        preferred.toLowerCase().includes(field.toLowerCase())
    );

    if (matchesField) {
      return {
        matches: true,
        reason: `Field of study matches: ${field}`,
      };
    }
  }

  return {
    matches: false,
    reason: `Field of study does not match preferred: ${preferredFields.join(", ")}`,
  };
};

const matchesKeywords = (text, keywords) => {
  return keywords.some((keyword) => text.toUpperCase().includes(keyword.toUpperCase()));
};

const isTier1Institution = (institution) => {
  return TIER1_INSTITUTIONS.some((tier1) => institution.toUpperCase().includes(tier1.toUpperCase()));
};

export const filterCandidatesByEducation = (job, candidates) => {
  return candidates
    .map((candidate) => {
      const matchResult = matchesEducationPreferences(job.educationPreferences, candidate.education);

      return {
        ...candidate,
        educationMatch: matchResult,
      };
    })
    .filter((candidate) => candidate.educationMatch.matches)
    .sort((a, b) => b.educationMatch.score - a.educationMatch.score);
};

export const getEducationMatchScore = (jobEducationPrefs, candidateEducation) => {
  const result = matchesEducationPreferences(jobEducationPrefs, candidateEducation);
  return result.score;
};
