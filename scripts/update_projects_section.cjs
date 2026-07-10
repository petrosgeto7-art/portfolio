const fs = require('fs');
let code = fs.readFileSync('src/components/sections/Projects.tsx', 'utf8');

code = code.replace(/const fetchProjects = async \(\) => \{[\s\S]*?fetchProjects\(\);\s*\}, \[\]\);/m, 
`const fetchProjects = async () => {
      try {
        const data = await apiFetch('/projects');
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);`);
fs.writeFileSync('src/components/sections/Projects.tsx', code);
