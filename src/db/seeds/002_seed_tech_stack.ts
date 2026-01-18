import { Knex } from 'knex';

/**
 * Seed file to populate tech_stack table with 100 commonly used technologies
 * 
 * To use this seed file:
 * Run: npm run seed:run
 * 
 * This will insert 100 technologies across various categories:
 * - Frontend (30 entries)
 * - Backend (25 entries)
 * - Database (15 entries)
 * - DevOps (15 entries)
 * - Mobile (10 entries)
 * - Tools (5 entries)
 */

export async function seed(knex: Knex): Promise<void> {
  // Check if tech stack already has data
  const existingCount = await knex('data.tech_stack').count('id as count').first();
  const count = parseInt(existingCount?.count as string || '0', 10);

  if (count > 0) {
    console.log(`Tech stack already has ${count} entries. Skipping seed.`);
    return;
  }

  const now = new Date();

  // Tech stack data organized by category with priority
  const techStackData = [
    // Frontend Technologies (30 entries)
    { name: 'React', category: 'frontend', priority: 100, icon_url: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'Vue.js', category: 'frontend', priority: 95, icon_url: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
    { name: 'Angular', category: 'frontend', priority: 90, icon_url: 'https://cdn.simpleicons.org/angular/DD0031' },
    { name: 'Next.js', category: 'frontend', priority: 95, icon_url: 'https://cdn.simpleicons.org/nextdotjs/000000' },
    { name: 'Nuxt.js', category: 'frontend', priority: 85, icon_url: 'https://cdn.simpleicons.org/nuxtdotjs/00DC82' },
    { name: 'Svelte', category: 'frontend', priority: 80, icon_url: 'https://cdn.simpleicons.org/svelte/FF3E00' },
    { name: 'TypeScript', category: 'frontend', priority: 98, icon_url: 'https://cdn.simpleicons.org/typescript/3178C6' },
    { name: 'JavaScript', category: 'frontend', priority: 100, icon_url: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { name: 'HTML5', category: 'frontend', priority: 100, icon_url: 'https://cdn.simpleicons.org/html5/E34F26' },
    { name: 'CSS3', category: 'frontend', priority: 100, icon_url: 'https://cdn.simpleicons.org/css3/1572B6' },
    { name: 'Tailwind CSS', category: 'frontend', priority: 92, icon_url: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'Bootstrap', category: 'frontend', priority: 88, icon_url: 'https://cdn.simpleicons.org/bootstrap/7952B3' },
    { name: 'Sass', category: 'frontend', priority: 85, icon_url: 'https://cdn.simpleicons.org/sass/CC6699' },
    { name: 'Less', category: 'frontend', priority: 70, icon_url: 'https://cdn.simpleicons.org/less/1D365D' },
    { name: 'Styled Components', category: 'frontend', priority: 82, icon_url: 'https://cdn.simpleicons.org/styledcomponents/DB7093' },
    { name: 'Material-UI', category: 'frontend', priority: 87, icon_url: 'https://cdn.simpleicons.org/mui/007FFF' },
    { name: 'Ant Design', category: 'frontend', priority: 83, icon_url: 'https://cdn.simpleicons.org/antdesign/0170FE' },
    { name: 'Chakra UI', category: 'frontend', priority: 80, icon_url: 'https://cdn.simpleicons.org/chakraui/319795' },
    { name: 'Redux', category: 'frontend', priority: 90, icon_url: 'https://cdn.simpleicons.org/redux/764ABC' },
    { name: 'Zustand', category: 'frontend', priority: 75, icon_url: 'https://cdn.simpleicons.org/zustand/000000' },
    { name: 'GraphQL', category: 'frontend', priority: 85, icon_url: 'https://cdn.simpleicons.org/graphql/E10098' },
    { name: 'Apollo', category: 'frontend', priority: 80, icon_url: 'https://cdn.simpleicons.org/apollographql/311C87' },
    { name: 'Webpack', category: 'frontend', priority: 88, icon_url: 'https://cdn.simpleicons.org/webpack/8DD6F9' },
    { name: 'Vite', category: 'frontend', priority: 92, icon_url: 'https://cdn.simpleicons.org/vite/646CFF' },
    { name: 'Parcel', category: 'frontend', priority: 70, icon_url: 'https://cdn.simpleicons.org/parcel/000000' },
    { name: 'Jest', category: 'frontend', priority: 85, icon_url: 'https://cdn.simpleicons.org/jest/C21325' },
    { name: 'Cypress', category: 'frontend', priority: 80, icon_url: 'https://cdn.simpleicons.org/cypress/17202C' },
    { name: 'Playwright', category: 'frontend', priority: 75, icon_url: 'https://cdn.simpleicons.org/playwright/45BA4B' },
    { name: 'Storybook', category: 'frontend', priority: 75, icon_url: 'https://cdn.simpleicons.org/storybook/FF4785' },
    { name: 'Three.js', category: 'frontend', priority: 70, icon_url: 'https://cdn.simpleicons.org/threedotjs/000000' },

    // Backend Technologies (25 entries)
    { name: 'Node.js', category: 'backend', priority: 100, icon_url: 'https://cdn.simpleicons.org/nodedotjs/339933' },
    { name: 'Express', category: 'backend', priority: 95, icon_url: 'https://cdn.simpleicons.org/express/000000' },
    { name: 'NestJS', category: 'backend', priority: 90, icon_url: 'https://cdn.simpleicons.org/nestjs/E0234E' },
    { name: 'Python', category: 'backend', priority: 98, icon_url: 'https://cdn.simpleicons.org/python/3776AB' },
    { name: 'Django', category: 'backend', priority: 92, icon_url: 'https://cdn.simpleicons.org/django/092E20' },
    { name: 'Flask', category: 'backend', priority: 88, icon_url: 'https://cdn.simpleicons.org/flask/000000' },
    { name: 'FastAPI', category: 'backend', priority: 85, icon_url: 'https://cdn.simpleicons.org/fastapi/009688' },
    { name: 'Java', category: 'backend', priority: 95, icon_url: 'https://cdn.simpleicons.org/java/ED8B00' },
    { name: 'Spring Boot', category: 'backend', priority: 90, icon_url: 'https://cdn.simpleicons.org/spring/6DB33F' },
    { name: 'Go', category: 'backend', priority: 88, icon_url: 'https://cdn.simpleicons.org/go/00ADD8' },
    { name: 'Gin', category: 'backend', priority: 80, icon_url: 'https://cdn.simpleicons.org/gin/00ADD8' },
    { name: 'Ruby', category: 'backend', priority: 85, icon_url: 'https://cdn.simpleicons.org/ruby/CC342D' },
    { name: 'Ruby on Rails', category: 'backend', priority: 88, icon_url: 'https://cdn.simpleicons.org/rubyonrails/CC0000' },
    { name: 'PHP', category: 'backend', priority: 90, icon_url: 'https://cdn.simpleicons.org/php/777BB4' },
    { name: 'Laravel', category: 'backend', priority: 87, icon_url: 'https://cdn.simpleicons.org/laravel/FF2D20' },
    { name: 'Symfony', category: 'backend', priority: 80, icon_url: 'https://cdn.simpleicons.org/symfony/000000' },
    { name: 'C#', category: 'backend', priority: 88, icon_url: 'https://cdn.simpleicons.org/csharp/239120' },
    { name: '.NET', category: 'backend', priority: 85, icon_url: 'https://cdn.simpleicons.org/dotnet/512BD4' },
    { name: 'ASP.NET', category: 'backend', priority: 82, icon_url: 'https://cdn.simpleicons.org/dotnet/512BD4' },
    { name: 'Rust', category: 'backend', priority: 80, icon_url: 'https://cdn.simpleicons.org/rust/000000' },
    { name: 'Kotlin', category: 'backend', priority: 75, icon_url: 'https://cdn.simpleicons.org/kotlin/7F52FF' },
    { name: 'Scala', category: 'backend', priority: 70, icon_url: 'https://cdn.simpleicons.org/scala/DC322F' },
    { name: 'Elixir', category: 'backend', priority: 70, icon_url: 'https://cdn.simpleicons.org/elixir/4B275F' },
    { name: 'Phoenix', category: 'backend', priority: 68, icon_url: 'https://cdn.simpleicons.org/elixir/4B275F' },
    { name: 'GraphQL', category: 'backend', priority: 85, icon_url: 'https://cdn.simpleicons.org/graphql/E10098' },

    // Database Technologies (15 entries)
    { name: 'PostgreSQL', category: 'database', priority: 95, icon_url: 'https://cdn.simpleicons.org/postgresql/4169E1' },
    { name: 'MySQL', category: 'database', priority: 92, icon_url: 'https://cdn.simpleicons.org/mysql/4479A1' },
    { name: 'MongoDB', category: 'database', priority: 90, icon_url: 'https://cdn.simpleicons.org/mongodb/47A248' },
    { name: 'Redis', category: 'database', priority: 88, icon_url: 'https://cdn.simpleicons.org/redis/DC382D' },
    { name: 'SQLite', category: 'database', priority: 85, icon_url: 'https://cdn.simpleicons.org/sqlite/003B57' },
    { name: 'MariaDB', category: 'database', priority: 80, icon_url: 'https://cdn.simpleicons.org/mariadb/003545' },
    { name: 'Oracle', category: 'database', priority: 75, icon_url: 'https://cdn.simpleicons.org/oracle/F80000' },
    { name: 'SQL Server', category: 'database', priority: 78, icon_url: 'https://cdn.simpleicons.org/microsoftsqlserver/CC2927' },
    { name: 'Cassandra', category: 'database', priority: 70, icon_url: 'https://cdn.simpleicons.org/apachecassandra/1287B1' },
    { name: 'Elasticsearch', category: 'database', priority: 82, icon_url: 'https://cdn.simpleicons.org/elasticsearch/005571' },
    { name: 'DynamoDB', category: 'database', priority: 75, icon_url: 'https://cdn.simpleicons.org/amazondynamodb/4053D6' },
    { name: 'Firebase', category: 'database', priority: 85, icon_url: 'https://cdn.simpleicons.org/firebase/FFCA28' },
    { name: 'Supabase', category: 'database', priority: 80, icon_url: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
    { name: 'Prisma', category: 'database', priority: 83, icon_url: 'https://cdn.simpleicons.org/prisma/2D3748' },
    { name: 'Sequelize', category: 'database', priority: 75, icon_url: 'https://cdn.simpleicons.org/sequelize/52B0E7' },

    // DevOps Technologies (15 entries)
    { name: 'Docker', category: 'devops', priority: 95, icon_url: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Kubernetes', category: 'devops', priority: 90, icon_url: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'AWS', category: 'devops', priority: 95, icon_url: 'https://cdn.simpleicons.org/amazonaws/232F3E' },
    { name: 'Azure', category: 'devops', priority: 88, icon_url: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
    { name: 'Google Cloud', category: 'devops', priority: 87, icon_url: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
    { name: 'Terraform', category: 'devops', priority: 85, icon_url: 'https://cdn.simpleicons.org/terraform/7B42BC' },
    { name: 'Ansible', category: 'devops', priority: 80, icon_url: 'https://cdn.simpleicons.org/ansible/EE0000' },
    { name: 'Jenkins', category: 'devops', priority: 82, icon_url: 'https://cdn.simpleicons.org/jenkins/D24939' },
    { name: 'GitHub Actions', category: 'devops', priority: 90, icon_url: 'https://cdn.simpleicons.org/githubactions/2088FF' },
    { name: 'GitLab CI', category: 'devops', priority: 85, icon_url: 'https://cdn.simpleicons.org/gitlab/FC6D26' },
    { name: 'CircleCI', category: 'devops', priority: 75, icon_url: 'https://cdn.simpleicons.org/circleci/343434' },
    { name: 'Travis CI', category: 'devops', priority: 70, icon_url: 'https://cdn.simpleicons.org/travisci/3EAAAF' },
    { name: 'Nginx', category: 'devops', priority: 88, icon_url: 'https://cdn.simpleicons.org/nginx/009639' },
    { name: 'Apache', category: 'devops', priority: 80, icon_url: 'https://cdn.simpleicons.org/apache/D22128' },
    { name: 'Vercel', category: 'devops', priority: 85, icon_url: 'https://cdn.simpleicons.org/vercel/000000' },

    // Mobile Technologies (10 entries)
    { name: 'React Native', category: 'mobile', priority: 95, icon_url: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'Flutter', category: 'mobile', priority: 90, icon_url: 'https://cdn.simpleicons.org/flutter/02569B' },
    { name: 'Swift', category: 'mobile', priority: 88, icon_url: 'https://cdn.simpleicons.org/swift/FA7343' },
    { name: 'Kotlin', category: 'mobile', priority: 85, icon_url: 'https://cdn.simpleicons.org/kotlin/7F52FF' },
    { name: 'Ionic', category: 'mobile', priority: 75, icon_url: 'https://cdn.simpleicons.org/ionic/3880FF' },
    { name: 'Xamarin', category: 'mobile', priority: 70, icon_url: 'https://cdn.simpleicons.org/xamarin/3498DB' },
    { name: 'Cordova', category: 'mobile', priority: 65, icon_url: 'https://cdn.simpleicons.org/apachecordova/E8E8E8' },
    { name: 'Expo', category: 'mobile', priority: 80, icon_url: 'https://cdn.simpleicons.org/expo/000020' },
    { name: 'NativeScript', category: 'mobile', priority: 68, icon_url: 'https://cdn.simpleicons.org/nativescript/3655FF' },
    { name: 'Unity', category: 'mobile', priority: 75, icon_url: 'https://cdn.simpleicons.org/unity/000000' },

    // Tools & Others (5 entries)
    { name: 'Git', category: 'tools', priority: 100, icon_url: 'https://cdn.simpleicons.org/git/F05032' },
    { name: 'VS Code', category: 'tools', priority: 95, icon_url: 'https://cdn.simpleicons.org/visualstudiocode/007ACC' },
    { name: 'Postman', category: 'tools', priority: 85, icon_url: 'https://cdn.simpleicons.org/postman/FF6C37' },
    { name: 'Figma', category: 'tools', priority: 90, icon_url: 'https://cdn.simpleicons.org/figma/F24E1E' },
    { name: 'Jira', category: 'tools', priority: 80, icon_url: 'https://cdn.simpleicons.org/jira/0052CC' },
  ];

  // Insert all tech stack entries
  await knex('data.tech_stack').insert(
    techStackData.map((tech) => ({
      name: tech.name,
      category: tech.category,
      priority: tech.priority,
      icon_url: tech.icon_url,
      created_at: now,
      updated_at: now,
    }))
  );

  console.log(`✅ Successfully seeded ${techStackData.length} tech stack entries!`);
  console.log(`   - Frontend: ${techStackData.filter(t => t.category === 'frontend').length} entries`);
  console.log(`   - Backend: ${techStackData.filter(t => t.category === 'backend').length} entries`);
  console.log(`   - Database: ${techStackData.filter(t => t.category === 'database').length} entries`);
  console.log(`   - DevOps: ${techStackData.filter(t => t.category === 'devops').length} entries`);
  console.log(`   - Mobile: ${techStackData.filter(t => t.category === 'mobile').length} entries`);
  console.log(`   - Tools: ${techStackData.filter(t => t.category === 'tools').length} entries`);
}
