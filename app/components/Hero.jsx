import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full flex flex-col justify-center items-center relative">
      <div className="absolute inset-0 bg-cover background bg-center"></div>

      <div className="relative space-x-4 z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center p-10 backdrop-blur-lg bg-gradient-to-r from-white/20 to-black/20 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2 p-6 flex justify-center order-2 md:order-1">
          <Image
            src="/demo.png"
            alt="Chatbot"
            width={500}
            height={500}
            className="rounded-lg scale-110 shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 text-white order-1 md:order-2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            ProfsRated AI
          </h1>
          <p className="mb-8 text-lg">
            Get professor insights instantly with ProfsRated AI. Trained on Rate
            My Professor data, it’s your go-to tool for choosing the best
            courses and professors.
          </p>
          <SignInButton mode="modal">
            <button className="custom-signin-button bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600">
              Get Started Now
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
