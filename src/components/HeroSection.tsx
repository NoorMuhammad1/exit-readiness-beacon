import { CheckCircle, Lock } from "lucide-react";
import { AuthAwareActions } from "./AuthAwareActions";

const HeroSection = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-background to-primary-secondary opacity-40" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-success/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/10 backdrop-blur-sm">
              <Lock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Confidential Assessment</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                Are You{" "}
                <span className="text-luxury bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  PE Ready?
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground-secondary leading-relaxed">
                4-week operational assessment for founders considering private equity or strategic exit.
              </p>
            </div>
            <AuthAwareActions />

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-success border-2 border-background" />
                ))}
              </div>
              <div className="text-sm text-foreground-secondary">
                Assessment for founders by founders
              </div>
            </div>
          </div>

          {/* Right Side - Stats/Visual */}
          <div className="relative">
            <div className="glass-card p-8 rounded-2xl luxury-shadow">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Assessment Preview</h3>
                  <p className="text-foreground-secondary">What we evaluate in 4 weeks</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    "Financial Architecture & KPIs",
                    "Operational Excellence Score", 
                    "Management Team Depth",
                    "Growth Trajectory Analysis",
                    "Risk Factor Assessment",
                    "PE Ready Rating"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;