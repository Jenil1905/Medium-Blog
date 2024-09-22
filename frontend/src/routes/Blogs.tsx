import { Link } from "react-router-dom";
import { BlogSchema } from "@shishuranjan/backend-common/dist/validations";
import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import Header2 from "../components/Headers2";
import Header from "../components/Headers";
function getLoginInfo() {
  const isLogin = localStorage.getItem("isLogin");
  if (isLogin === "true") {
    console.log("return true ");
    return true;
  }
  console.log("return False");
  return false;
}

interface posts {
  id: String;
  title: String;
  content: String;
  published: Boolean;
  authorId: String;
}
const token = localStorage.getItem("jwt-token");
console.log(`this is your token ${token}`);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:8787/api/v1/blog/bulk`, {
        headers: {
          //    "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(`Posts length:`, res.data.posts.length);
        if (res.data.posts.length === 0) {
          setShowMessage(true);
        }
        setPosts(res.data.posts);
        const description = res.data.posts.map((post) => {
          setDescription(post.title.substring(0, 5));
        });
        console.log("description is", description);
      });
  }, []);

  const isLogin = getLoginInfo();
  return (
    <div>
      {localStorage.getItem("isLogin") === "true" ? <Header2 /> : <Header />}
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 flex flex-col items-center py-8">
          <section className="w-full max-w-5xl">
            {/* User Info Section */}
            <div className="flex justify-between items-center mb-8 p-6 rounded-lg ">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, Shishu!</h1>
                <p className="text-gray-600">Here are your blog posts:</p>
              </div>
              <div>
                <Link
                  to="/upload_blogs"
                  className="inline-block px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Create New Post
                </Link>
              </div>
            </div>

            {/* Posts List */}
            <div className="grid gap-6 lg:grid-cols-2">
              {posts.length > 0 ? (
                posts.map((post: posts) => (
                  <div
                    key={post.id}
                    className="bg-white p-6 shadow rounded-lg border flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{post.content}</p>

                      <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                    </div>
                    <a
                      href={`http://localhost:8787/api/v1/blog/get/${post.id}`}
                      className="inline-block text-blue-500 hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                ))
              ) : showMessage ? (
                <div className="bg-white p-6 shadow rounded-lg border flex justify-between">
                  {" "}
                  Start uploading Blog to get started 🎉{" "}
                </div>
              ) : (
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                  ]}
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
