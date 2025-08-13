// ==========================================
// 2. GOOGLE JOBS SCHEMA GENERATOR
// lib/google-jobs/schema-generator.ts

interface JobData {
  title: string;
  description: string;
  companyName: string;
  companyWebsite?: string;
  companyLogo?: string;
  location: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN';
  datePosted: Date;
  validThrough: Date;
  remote?: boolean;
  benefits?: string[];
  requirements?: {
    education?: string;
    experience?: string;
    skills?: string[];
  };
}

export function generateGoogleJobsSchema(jobData: JobData) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": jobData.title,
    "description": jobData.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": jobData.companyName,
      "value": generateJobId()
    },
    "datePosted": jobData.datePosted.toISOString(),
    "validThrough": jobData.validThrough.toISOString(),
    "employmentType": jobData.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": jobData.companyName,
      ...(jobData.companyWebsite && { "sameAs": jobData.companyWebsite }),
      ...(jobData.companyLogo && { "logo": jobData.companyLogo })
    },
    "jobLocation": jobData.remote ? {
      "@type": "Place",
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": jobData.location.addressCountry
      }
    } : {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        ...(jobData.location.streetAddress && { "streetAddress": jobData.location.streetAddress }),
        "addressLocality": jobData.location.addressLocality,
        "addressRegion": jobData.location.addressRegion,
        ...(jobData.location.postalCode && { "postalCode": jobData.location.postalCode }),
        "addressCountry": jobData.location.addressCountry
      }
    }
  };

  // Add salary information if provided
  if (jobData.salary) {
    schema["baseSalary"] = {
      "@type": "MonetaryAmount",
      "currency": jobData.salary.currency,
      "value": {
        "@type": "QuantitativeValue",
        "minValue": jobData.salary.min,
        "maxValue": jobData.salary.max,
        "unitText": jobData.salary.period
      }
    };
  }

  // Add remote work information
  if (jobData.remote) {
    schema["jobLocationType"] = "TELECOMMUTE";
  }

  // Add benefits if provided
  if (jobData.benefits && jobData.benefits.length > 0) {
    schema["jobBenefits"] = jobData.benefits.join(", ");
  }

  // Add requirements if provided
  if (jobData.requirements?.education) {
    schema["educationRequirements"] = jobData.requirements.education;
  }

  if (jobData.requirements?.experience) {
    schema["experienceRequirements"] = jobData.requirements.experience;
  }

  return schema;
}

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
