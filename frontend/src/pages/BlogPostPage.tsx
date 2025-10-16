import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon, TagIcon, ArrowLeftIcon, ShareIcon, FacebookIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
const BlogPostPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const posts = [{
    id: '1',
    title: 'Getting Started with Arduino for Beginners',
    excerpt: 'Learn the basics of Arduino programming and create your first electronic project with this step-by-step guide.',
    content: `
        <p>Arduino is an open-source electronics platform based on easy-to-use hardware and software. It's intended for anyone making interactive projects.</p>
        <h2>What is Arduino?</h2>
        <p>Arduino boards are able to read inputs - light on a sensor, a finger on a button, or a Twitter message - and turn it into an output - activating a motor, turning on an LED, publishing something online. You can tell your board what to do by sending a set of instructions to the microcontroller on the board.</p>
        <p>To do so you use the Arduino programming language (based on Wiring), and the Arduino Software (IDE), based on Processing.</p>
        <h2>Why Arduino?</h2>
        <p>Thanks to its simple and accessible user experience, Arduino has been used in thousands of different projects and applications. The Arduino software is easy-to-use for beginners, yet flexible enough for advanced users. It runs on Mac, Windows, and Linux. Teachers and students use it to build low cost scientific instruments, to prove chemistry and physics principles, or to get started with programming and robotics.</p>
        <h2>Getting Started</h2>
        <p>To get started with Arduino, you'll need:</p>
        <ul>
          <li>An Arduino board (Uno is recommended for beginners)</li>
          <li>USB A to B cable</li>
          <li>Arduino IDE software</li>
          <li>Basic electronic components (LEDs, resistors, breadboard)</li>
        </ul>
        <h2>Your First Arduino Project: Blinking LED</h2>
        <p>Let's create a simple project that blinks an LED - the "Hello World" of hardware programming.</p>
        <h3>Step 1: Set up your hardware</h3>
        <p>Connect your Arduino to your computer using the USB cable. Then, connect an LED to pin 13 and GND on your Arduino. Most Arduino boards have a built-in LED connected to pin 13, so you might not even need an external LED for this first project.</p>
        <h3>Step 2: Write your code</h3>
        <pre><code>
// The setup function runs once when you press reset or power the board
void setup() {
  // Initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
}
// The loop function runs over and over again forever
void loop() {
  digitalWrite(13, HIGH);   // Turn the LED on
  delay(1000);              // Wait for a second
  digitalWrite(13, LOW);    // Turn the LED off
  delay(1000);              // Wait for a second
}
        </code></pre>
        <h3>Step 3: Upload your code</h3>
        <p>Click the upload button in the Arduino IDE to compile and upload your code to the Arduino board. If everything is set up correctly, you should see the LED start to blink!</p>
        <h2>Next Steps</h2>
        <p>Now that you've completed your first Arduino project, you can explore more complex projects like:</p>
        <ul>
          <li>Reading analog sensors</li>
          <li>Controlling motors</li>
          <li>Building simple robots</li>
          <li>Creating IoT devices</li>
        </ul>
        <p>Join us at iZonehub Makerspace for our regular Arduino workshops where we can help you take your projects to the next level!</p>
      `,
    date: '2023-08-15',
    author: 'Farai Chikwanda',
    authorImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    authorBio: 'Farai is an electronics engineer and educator with over 8 years of experience in hardware development. He leads the Hardware Development Community at iZonehub Makerspace.',
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    categories: ['hardware', 'tutorials'],
    readTime: '8 min read',
    relatedPosts: ['3', '5']
  }, {
    id: '2',
    title: 'Web Development Trends in 2023',
    excerpt: 'Explore the latest trends and technologies shaping the future of web development and how you can stay ahead.',
    content: `
        <p>The web development landscape is constantly evolving, with new frameworks, tools, and methodologies emerging each year. Staying updated with these trends is crucial for developers who want to remain competitive and build modern web applications.</p>
        <h2>1. Progressive Web Apps (PWAs)</h2>
        <p>Progressive Web Apps continue to gain traction as they combine the best of web and mobile apps. They work offline, load quickly, and can be installed on a user's device without going through an app store.</p>
        <p>Key features of PWAs include:</p>
        <ul>
          <li>Offline functionality</li>
          <li>Push notifications</li>
          <li>Home screen installation</li>
          <li>App-like experience</li>
        </ul>
        <h2>2. Jamstack Architecture</h2>
        <p>Jamstack (JavaScript, APIs, and Markup) is an architecture designed to make the web faster, more secure, and easier to scale. It pre-renders sites and serves them as static HTML files, which can be enhanced with JavaScript and APIs.</p>
        <h2>3. Headless CMS</h2>
        <p>Headless CMS platforms separate the content management from the presentation layer, allowing developers to use their preferred frameworks and tools for the frontend while managing content through a user-friendly interface.</p>
        <h2>4. AI and Machine Learning Integration</h2>
        <p>AI is becoming more accessible to web developers through various APIs and libraries. From chatbots to personalized user experiences, AI integration is enhancing web applications in numerous ways.</p>
        <h2>5. WebAssembly (Wasm)</h2>
        <p>WebAssembly allows code written in languages like C, C++, and Rust to run in the browser at near-native speed. This opens up possibilities for bringing desktop-quality applications to the web.</p>
        <h2>6. Micro-Frontends</h2>
        <p>Micro-frontends extend the microservices concept to frontend development, allowing teams to build and deploy parts of a website or app independently.</p>
        <h2>7. API-First Development</h2>
        <p>With the rise of headless architectures and microservices, API-first development has become a standard approach. This methodology prioritizes the design and development of APIs before implementing the actual functionality.</p>
        <h2>8. Low-Code/No-Code Development</h2>
        <p>Low-code and no-code platforms are making web development more accessible to non-developers, enabling faster prototyping and development of simple applications.</p>
        <h2>How to Stay Updated</h2>
        <p>To keep up with these rapidly evolving trends:</p>
        <ul>
          <li>Follow tech blogs and newsletters</li>
          <li>Participate in online communities and forums</li>
          <li>Attend web development conferences and meetups</li>
          <li>Experiment with new technologies through side projects</li>
          <li>Join our Software Development Community at iZonehub Makerspace</li>
        </ul>
        <p>At iZonehub, we regularly host workshops and discussions on the latest web development trends. Join us to connect with other developers and stay at the forefront of web technology in Zimbabwe.</p>
      `,
    date: '2023-07-28',
    author: 'Tatenda Moyo',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    authorBio: 'Tatenda is a full-stack developer and tech educator with a passion for emerging web technologies. He leads workshops at iZonehub Makerspace and consults for local startups.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    categories: ['software', 'trends'],
    readTime: '6 min read',
    relatedPosts: ['4', '6']
  }
  // Additional posts would be defined here...
  ];
  const post = posts.find(post => post.id === id);
  if (!post) {
    return <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-white/70 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blog" className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-white hover:shadow-neon transition-all duration-300">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>;
  }
  const relatedPosts = post.relatedPosts ? posts.filter(p => post.relatedPosts.includes(p.id)) : [];
  return <div className="min-h-screen bg-dark">
      {/* Hero section */}
      <div className="relative h-96 md:h-[500px] flex items-end" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.9)), url(${post.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category, index) => <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm capitalize">
                {category}
              </span>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div>
                <p className="font-medium">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <CalendarIcon size={18} className="mr-2" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </time>
            </div>
            <div className="flex items-center text-white/70">
              <ClockIcon size={18} className="mr-2" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Article content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <article className="prose prose-invert prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{
              __html: post.content
            }} />
            </article>
            {/* Article footer */}
            <div className="mt-12 pt-8 border-t border-neutral/20">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                  {post.categories.map((category, index) => <Link key={index} to={`/blog?category=${category}`} className="bg-dark-lighter text-white/80 hover:bg-primary/20 hover:text-primary px-3 py-1 rounded-full text-sm capitalize transition-all duration-300 flex items-center">
                      <TagIcon size={14} className="mr-1" />
                      {category}
                    </Link>)}
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-white/70">Share:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <FacebookIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <TwitterIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <LinkedinIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <ShareIcon size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Author bio */}
            <div className="mt-12 bg-dark-lighter p-8 rounded-lg border border-neutral/20">
              <div className="flex items-start">
                <img src={post.authorImage} alt={post.author} className="w-16 h-16 rounded-full object-cover mr-6" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-white/70 mb-4">{post.authorBio}</p>
                  <Link to={`/blog?author=${encodeURIComponent(post.author)}`} className="text-primary hover:text-primary/80">
                    View all posts by {post.author.split(' ')[0]}
                  </Link>
                </div>
              </div>
            </div>
            {/* Related articles */}
            {relatedPosts.length > 0 && <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(relatedPost => <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20 hover:border-primary/40 transition-all duration-300">
                      <div className="h-48 overflow-hidden">
                        <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-white/70 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>)}
                </div>
              </div>}
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Table of contents would go here - simplified for now */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden mb-8">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Table of Contents</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        What is Arduino?
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Why Arduino?
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Getting Started
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Your First Arduino Project
                      </a>
                      <ul className="ml-4 mt-2 space-y-2">
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 1: Set up your hardware
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 2: Write your code
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 3: Upload your code
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Next Steps
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Join community */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Join Our Community</h3>
                </div>
                <div className="p-6">
                  <p className="text-white/70 mb-6">
                    Interested in learning more about {post.categories[0]}? Join
                    our community at iZonehub Makerspace!
                  </p>
                  <Link to="/communities#join" className="inline-flex items-center justify-center w-full px-6 py-2 rounded-full bg-primary text-white hover:shadow-neon transition-all duration-300">
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BlogPostPage;