// Mock data for Student Signal platform

export const heroImages = [
  "https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwY2FtcHVzfGVufDB8fHx8MTc2NDExMTI0NXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1758270705641-acf09b68a91f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwY2FtcHVzfGVufDB8fHx8MTc2NDExMTI0NXww&ixlib=rb-4.1.0&q=85",
  "https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg",
  "https://images.unsplash.com/photo-1722648325285-058946b4487b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxjb2xsZWdlJTIwZ3JhZHVhdGlvbnxlbnwwfHx8fDE3NjQxMTEyNTZ8MA&ixlib=rb-4.1.0&q=85",
];

export const colleges = [
  {
    id: 1,
    name: "University of California, Los Angeles",
    shortName: "UCLA",
    location: "Los Angeles, CA",
    state: "California",
    type: "Public",
    enrollment: 45428,
    acceptanceRate: 9,
    tuitionInState: 13401,
    tuitionOutState: 44830,
    satRange: "1300-1530",
    actRange: "29-34",
    graduationRate: 92,
    ranking: 15,
    rating: "A+",
    image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
    description: "UCLA is a public land-grant research university in Los Angeles, California.",
    directAdmission: true,
    majors: ["Engineering", "Business", "Computer Science", "Film", "Biology"],
    features: ["Research University", "D1 Sports", "Urban Campus"]
  },
  {
    id: 2,
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    location: "Berkeley, CA",
    state: "California",
    type: "Public",
    enrollment: 45057,
    acceptanceRate: 11,
    tuitionInState: 14312,
    tuitionOutState: 44066,
    satRange: "1330-1530",
    actRange: "30-35",
    graduationRate: 93,
    ranking: 4,
    rating: "A+",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800",
    description: "UC Berkeley is a public research university in Berkeley, California.",
    directAdmission: true,
    majors: ["Computer Science", "Engineering", "Economics", "Political Science", "Chemistry"],
    features: ["Research University", "Nobel Laureates", "Innovation Hub"]
  },
  {
    id: 3,
    name: "Stanford University",
    shortName: "Stanford",
    location: "Stanford, CA",
    state: "California",
    type: "Private",
    enrollment: 17534,
    acceptanceRate: 4,
    tuitionInState: 56169,
    tuitionOutState: 56169,
    satRange: "1500-1570",
    actRange: "33-35",
    graduationRate: 96,
    ranking: 2,
    rating: "A+",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
    description: "Stanford University is a private research university in Stanford, California.",
    directAdmission: false,
    majors: ["Computer Science", "Engineering", "Economics", "Biology", "Psychology"],
    features: ["Ivy Plus", "Silicon Valley", "Elite Research"]
  },
  {
    id: 4,
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    location: "Cambridge, MA",
    state: "Massachusetts",
    type: "Private",
    enrollment: 11574,
    acceptanceRate: 3,
    tuitionInState: 57986,
    tuitionOutState: 57986,
    satRange: "1520-1580",
    actRange: "34-36",
    graduationRate: 95,
    ranking: 1,
    rating: "A+",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    description: "MIT is a private research university in Cambridge, Massachusetts.",
    directAdmission: false,
    majors: ["Engineering", "Computer Science", "Physics", "Mathematics", "Economics"],
    features: ["STEM Leader", "Innovation Hub", "Research University"]
  },
  {
    id: 5,
    name: "University of Michigan",
    shortName: "UMich",
    location: "Ann Arbor, MI",
    state: "Michigan",
    type: "Public",
    enrollment: 47907,
    acceptanceRate: 18,
    tuitionInState: 16736,
    tuitionOutState: 55334,
    satRange: "1340-1530",
    actRange: "31-34",
    graduationRate: 93,
    ranking: 21,
    rating: "A+",
    image: "https://images.unsplash.com/photo-1599687266725-0d4d52a505f5?w=800",
    description: "University of Michigan is a public research university in Ann Arbor, Michigan.",
    directAdmission: true,
    majors: ["Engineering", "Business", "Psychology", "Economics", "Computer Science"],
    features: ["Big Ten", "Research University", "D1 Sports"]
  },
  {
    id: 6,
    name: "New York University",
    shortName: "NYU",
    location: "New York, NY",
    state: "New York",
    type: "Private",
    enrollment: 58226,
    acceptanceRate: 12,
    tuitionInState: 58168,
    tuitionOutState: 58168,
    satRange: "1350-1530",
    actRange: "31-35",
    graduationRate: 87,
    ranking: 35,
    rating: "A",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    description: "NYU is a private research university based in New York City.",
    directAdmission: true,
    majors: ["Business", "Film", "Drama", "Law", "Medicine"],
    features: ["Urban Campus", "Global Centers", "Arts & Culture"]
  },
  {
    id: 7,
    name: "University of Texas at Austin",
    shortName: "UT Austin",
    location: "Austin, TX",
    state: "Texas",
    type: "Public",
    enrollment: 51832,
    acceptanceRate: 31,
    tuitionInState: 11448,
    tuitionOutState: 40996,
    satRange: "1230-1480",
    actRange: "27-33",
    graduationRate: 88,
    ranking: 32,
    rating: "A",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
    description: "UT Austin is a public research university in Austin, Texas.",
    directAdmission: true,
    majors: ["Engineering", "Business", "Computer Science", "Communications", "Biology"],
    features: ["Big 12", "Research University", "Tech Hub"]
  },
  {
    id: 8,
    name: "University of Florida",
    shortName: "UF",
    location: "Gainesville, FL",
    state: "Florida",
    type: "Public",
    enrollment: 56567,
    acceptanceRate: 23,
    tuitionInState: 6380,
    tuitionOutState: 28658,
    satRange: "1300-1470",
    actRange: "28-33",
    graduationRate: 90,
    ranking: 28,
    rating: "A",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    description: "University of Florida is a public land-grant research university.",
    directAdmission: true,
    majors: ["Engineering", "Business", "Biology", "Psychology", "Journalism"],
    features: ["SEC", "Research University", "Gator Nation"]
  }
];

export const testimonials = [
  {
    id: 1,
    text: "During my college search, I was having a difficult time figuring out if I could get in to a school, so I turned to Student Signal to help. I especially liked looking at the rankings for different categories, academics, and much more!",
    author: "Amy G.",
    school: "UCLA Class of 2024",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  },
  {
    id: 2,
    text: "Student Signal helped me discover schools I never would have considered. The detailed information on each school and the comparison tools made my decision so much easier.",
    author: "Marcus T.",
    school: "MIT Class of 2025",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    id: 3,
    text: "As a first-generation college student, I didn't know where to start. Student Signal's personalized recommendations and direct admissions feature changed everything for me.",
    author: "Sofia R.",
    school: "Stanford Class of 2024",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
  }
];

export const bestOfLists = [
  { id: 1, title: "Best Colleges in America", count: 100, icon: "trophy" },
  { id: 2, title: "Best Public Universities", count: 50, icon: "building" },
  { id: 3, title: "Most Affordable Colleges", count: 50, icon: "dollar" },
  { id: 4, title: "Best College Campuses", count: 50, icon: "tree" },
  { id: 5, title: "Top Party Schools", count: 25, icon: "party" },
  { id: 6, title: "Best Student Life", count: 50, icon: "users" }
];

export const partnerSchools = [
  { id: 1, name: "Oregon State University", logo: "O" },
  { id: 2, name: "Washington State University", logo: "WSU" },
  { id: 3, name: "Marquette University", logo: "M" },
  { id: 4, name: "University of Denver", logo: "DU" }
];

export const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export const majorsList = [
  "Accounting", "Aerospace Engineering", "Biology", "Business Administration",
  "Chemical Engineering", "Chemistry", "Civil Engineering", "Communications",
  "Computer Science", "Criminal Justice", "Economics", "Education", "Electrical Engineering",
  "English", "Environmental Science", "Film Studies", "Finance", "Graphic Design",
  "History", "International Relations", "Journalism", "Marketing", "Mathematics",
  "Mechanical Engineering", "Music", "Nursing", "Philosophy", "Physics", "Political Science",
  "Pre-Law", "Pre-Med", "Psychology", "Public Health", "Sociology", "Theater"
];

export const navLinks = [
  { label: "College Search", href: "/colleges" },
  { label: "Graduate Schools", href: "/graduate" },
  { label: "Scholarships", href: "/scholarships" }
];

export const footerLinks = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Student Signal for Schools", href: "/for-schools" },
    { label: "Blog", href: "/blog" },
    { label: "College Rankings", href: "/rankings" },
    { label: "Data Privacy", href: "/privacy" },
    { label: "Contact Student Signal", href: "/contact" },
    { label: "Careers", href: "/careers" }
  ],
  colleges: [
    { label: "College Search", href: "/colleges" },
    { label: "Best Colleges", href: "/colleges/best" },
    { label: "Best Community Colleges", href: "/colleges/community" },
    { label: "Best Small Colleges", href: "/colleges/small" },
    { label: "Best Online Colleges", href: "/colleges/online" },
    { label: "Best Value Colleges", href: "/colleges/value" }
  ],
  graduate: [
    { label: "Best Business Schools", href: "/graduate/business" },
    { label: "Best Law Schools", href: "/graduate/law" },
    { label: "Best Medical Schools", href: "/graduate/medical" },
    { label: "Best Engineering Schools", href: "/graduate/engineering" },
    { label: "Best Nursing Schools", href: "/graduate/nursing" }
  ],
  scholarships: [
    { label: "All Scholarships", href: "/scholarships" },
    { label: "Merit Scholarships", href: "/scholarships/merit" },
    { label: "Need-Based Aid", href: "/scholarships/need-based" },
    { label: "First Generation", href: "/scholarships/first-gen" },
    { label: "STEM Scholarships", href: "/scholarships/stem" },
    { label: "Athletic Scholarships", href: "/scholarships/athletic" }
  ]
};

export const adminContent = {
  heroSection: {
    title: "FIND THE SCHOOL",
    subtitle: "THAT FITS YOU BEST",
    description: "Finding the right school shouldn't be hard. From K-12 to college to grad school, we'll help you find and connect with the best ones for you.",
    ctaButtons: [
      { label: "K-12 Schools", href: "/k12", variant: "outline" },
      { label: "Colleges", href: "/colleges", variant: "primary" },
      { label: "Grad Schools", href: "/graduate", variant: "outline" }
    ]
  },
  directAdmissions: {
    title: "Direct Admissions",
    tagline: "Get accepted without an application.",
    description: "No application or essay needed. With Direct Admissions, colleges can accept you based on the information in your Student Signal Profile."
  },
  searchSection: {
    tagline: "FIND YOUR NICHE",
    title: "Your search is unique.",
    subtitle: "Just like you.",
    description: "We give you all the data, reviews, and insights in one place to make your goals way less of impossible."
  },
  features: [
    {
      title: "NO HEAVY LIFTING",
      description: "We analyze the data so you don't have to.",
      icon: "chart"
    },
    {
      title: "THE GOOD, THE BAD, THE REAL",
      description: "Our peer reviews let you hear from current students to give you an honest and holistic view.",
      icon: "star"
    },
    {
      title: "LIKE A GLOVE",
      description: "We personalize your search based on what's most important to you.",
      icon: "heart"
    }
  ],
  testimonialsSection: {
    tagline: "REAL STUDENT SIGNAL STORIES",
    title: "Student Signal has helped millions of students and families find their fit."
  }
};
