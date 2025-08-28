#!/usr/bin/env node

// Markdown to HTML Converter Script
// Converts .md files in public/docs to .html files with proper styling

const fs = require('fs');
const path = require('path');

// HTML template with modern styling
const htmlTemplate = (title, content, navigation) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Community Moderation Tool</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            display: flex;
            gap: 2rem;
        }
        
        .sidebar {
            width: 250px;
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            height: fit-content;
            position: sticky;
            top: 2rem;
        }
        
        .sidebar h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #3498db;
        }
        
        .nav-links {
            list-style: none;
        }
        
        .nav-links li {
            margin-bottom: 0.5rem;
        }
        
        .nav-links a {
            display: block;
            padding: 0.75rem 1rem;
            text-decoration: none;
            color: #555;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .nav-links a:hover {
            background: #3498db;
            color: white;
            transform: translateX(5px);
        }
        
        .nav-links a.active {
            background: #3498db;
            color: white;
            font-weight: 600;
        }
        
        .main-content {
            flex: 1;
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .main-content h1 {
            color: #2c3e50;
            margin-bottom: 1.5rem;
            font-size: 2.5rem;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
        }
        
        .main-content h2 {
            color: #34495e;
            margin: 2rem 0 1rem 0;
            font-size: 1.8rem;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 0.5rem;
        }
        
        .main-content h3 {
            color: #34495e;
            margin: 1.5rem 0 1rem 0;
            font-size: 1.4rem;
        }
        
        .main-content p {
            margin-bottom: 1rem;
            color: #555;
        }
        
        .main-content ul, .main-content ol {
            margin: 1rem 0 1rem 2rem;
            color: #555;
        }
        
        .main-content li {
            margin-bottom: 0.5rem;
        }
        
        .main-content code {
            background: #f8f9fa;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e74c3c;
        }
        
        .main-content pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        .main-content pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        
        .main-content blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .main-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        .main-content th, .main-content td {
            border: 1px solid #ecf0f1;
            padding: 0.75rem;
            text-align: left;
        }
        
        .main-content th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .main-content tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            text-align: center;
        }
        
        .header h1 {
            color: white;
            border: none;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: rgba(255,255,255,0.9);
            font-size: 1.1rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
                padding: 1rem;
            }
            
            .sidebar {
                width: 100%;
                position: static;
            }
            
            .main-content {
                padding: 2rem;
            }
            
            .main-content h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <h3>📚 Documentation</h3>
            <ul class="nav-links">
                ${navigation}
            </ul>
        </div>
        
        <div class="main-content">
            <div class="header">
                <h1>${title}</h1>
                <p>Community Moderation Tool Documentation</p>
            </div>
            
            ${content}
            
            <div class="footer">
                <p>Generated from Markdown • Community Moderation Tool</p>
                <p>Last updated: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Simple Markdown to HTML converter
function markdownToHtml(markdown) {
    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Lists
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
        
        // Wrap lists in ul/ol tags
        .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
        
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gim, '<p>$1</p>')
        
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
        .replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1')
        .replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        
        // Line breaks
        .replace(/\n/g, '<br>');
}

// Generate navigation links
function generateNavigation(files, currentFile) {
    return files.map(file => {
        const name = path.basename(file, '.md');
        const htmlName = name + '.html';
        const isActive = currentFile === htmlName ? ' class="active"' : '';
        return `<li><a href="${htmlName}"${isActive}>${name}</a></li>`;
    }).join('');
}

// Main conversion function
function convertMarkdownFiles() {
    const docsDir = path.join(__dirname, 'public', 'docs');
    const outputDir = docsDir; // Output to same directory
    
    console.log('🔍 Scanning for Markdown files...');
    
    try {
        // Check if docs directory exists
        if (!fs.existsSync(docsDir)) {
            console.error('❌ public/docs directory not found!');
            return;
        }
        
        // Get all .md files
        const files = fs.readdirSync(docsDir)
            .filter(file => file.endsWith('.md'))
            .sort();
        
        if (files.length === 0) {
            console.log('ℹ️  No Markdown files found in public/docs/');
            return;
        }
        
        console.log(`📁 Found ${files.length} Markdown files:`);
        files.forEach(file => console.log(`   - ${file}`));
        
        // Convert each file
        files.forEach(file => {
            const mdPath = path.join(docsDir, file);
            const htmlFile = file.replace('.md', '.html');
            const htmlPath = path.join(outputDir, htmlFile);
            
            try {
                // Read Markdown content
                const markdown = fs.readFileSync(mdPath, 'utf8');
                
                // Extract title from first # header or filename
                let title = path.basename(file, '.md');
                const titleMatch = markdown.match(/^# (.*$)/m);
                if (titleMatch) {
                    title = titleMatch[1];
                }
                
                // Generate navigation
                const navigation = generateNavigation(files, htmlFile);
                
                // Convert to HTML
                const htmlContent = htmlTemplate(title, markdownToHtml(markdown), navigation);
                
                // Write HTML file
                fs.writeFileSync(htmlPath, htmlContent);
                
                console.log(`✅ Converted ${file} → ${htmlFile}`);
                
            } catch (error) {
                console.error(`❌ Error converting ${file}:`, error.message);
            }
        });
        
        console.log('\n🎉 Conversion complete!');
        console.log('\n📖 Access your HTML files at:');
        console.log(`   Local: http://127.0.0.1:3000/docs/`);
        console.log(`   Production: https://moderation-assistant-tool.vercel.app/docs/`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the conversion
if (require.main === module) {
    convertMarkdownFiles();
}

module.exports = { convertMarkdownFiles, markdownToHtml };

