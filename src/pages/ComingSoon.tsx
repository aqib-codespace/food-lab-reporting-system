"use client";
import { Sparkles, Rocket, Code, Zap, Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="">
      <div className=" w-full">
       

        <div className="">
          <div className="p-12 text-center">
            {/* Animated Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 mx-auto bg-linear-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-blue-600 via-teal-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
              Coming Soon
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-medium">
              We're building something amazing!
            </p>

            <p className="text-base text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Our team is working hard to bring you an incredible new feature.
              Stay tuned for updates as we craft an experience that will
              transform the way you work.
            </p>

           

            {/* Loading Animation */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-linear-to-r from-blue-600 to-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                In Development
              </span>
            </div>

            {/* CTA Button */}
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span>Notify Me When Ready</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

         
          </div>
        </div>

        <div className="absolute top-10 left-10 animate-float">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full blur-sm" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float delay-500">
          <div className="w-20 h-20 bg-teal-500/10 rounded-full blur-sm" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
