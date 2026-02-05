 import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Menu } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

 const Login = () => {
   const navigate = useNavigate();
   const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const [activeTab, setActiveTab] = useState("signin");
 
   // Redirect if already logged in
   useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session) {
         navigate("/", { replace: true });
       }
     });
   }, [navigate]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
 
     if (!error) {
       toast({
         title: "Welcome back!",
         description: "You have successfully signed in.",
       });
       navigate("/", { replace: true });
     } else {
       toast({
         title: "Invalid credentials",
         description: error.message || "Please check your email and password.",
         variant: "destructive",
       });
     }
 
     setIsLoading(false);
   };
 
   const handleSignUp = async (e: FormEvent) => {
     e.preventDefault();
     
     if (password !== confirmPassword) {
       toast({
         title: "Password mismatch",
         description: "Passwords do not match.",
         variant: "destructive",
       });
       return;
     }
 
     if (password.length < 8) {
       toast({
         title: "Weak password",
         description: "Password must be at least 8 characters.",
         variant: "destructive",
       });
       return;
     }
 
     setIsLoading(true);
 
     // Create user in Supabase Auth
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         data: { full_name: fullName },
       },
     });
 
     if (error) {
       toast({
         title: "Sign up failed",
         description: error.message,
         variant: "destructive",
       });
       setIsLoading(false);
       return;
     }
 
     if (data.user) {
       // Assign admin role to the first user
       const { error: roleError } = await supabase
         .from('user_roles')
         .insert({ user_id: data.user.id, role: 'admin' });
 
       if (roleError) {
         console.error('Role assignment error:', roleError);
       }
 
       // Update profile
       await supabase
         .from('profiles')
         .update({ full_name: fullName })
         .eq('user_id', data.user.id);
 
       toast({
         title: "Account created!",
         description: "Please check your email to verify your account, then sign in.",
       });
       setActiveTab("signin");
     }
 
     setIsLoading(false);
   };

  return (
    <div className="min-h-screen flex bg-[#0D0D0D] p-4 md:p-6">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-xl mr-4">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                #FF6B9D 0%, 
                #C084FC 25%, 
                #818CF8 50%, 
                #38BDF8 75%, 
                #2DD4BF 100%
              )
            `,
          }}
        />
        
        {/* Wave overlay effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 40% 80%, rgba(255,255,255,0.25) 0%, transparent 50%)
            `,
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-10 text-white">
          <span className="text-xs font-medium tracking-widest uppercase opacity-80 mb-4">
            A WISE QUOTE
          </span>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Get Everything<br />You Want
          </h2>
          <p className="text-base opacity-80 max-w-sm">
            You can get everything you want if you work hard, trust the process, and stick to the plan.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white rounded-xl">
        <div className="w-full max-w-md px-8 py-12">
          {/* Header */}
          <div className="flex items-center gap-2 mb-10">
            <Menu className="h-5 w-5 text-foreground" />
            <span className="text-lg font-semibold text-foreground">POS Admin</span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Login Form */}
           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             <TabsList className="grid w-full grid-cols-2 mb-6">
               <TabsTrigger value="signin">Sign In</TabsTrigger>
               <TabsTrigger value="signup">Sign Up</TabsTrigger>
             </TabsList>
 
             <TabsContent value="signin">
               <form onSubmit={handleSubmit} className="space-y-5">
                 {/* Email Field */}
                 <div className="space-y-2">
                   <Label htmlFor="email" className="text-sm font-medium text-foreground">
                     Email
                   </Label>
                   <Input
                     id="email"
                     type="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="h-11 rounded-lg border-input focus-visible:ring-primary"
                     required
                   />
                 </div>
 
                 {/* Password Field */}
                 <div className="space-y-2">
                   <Label htmlFor="password" className="text-sm font-medium text-foreground">
                     Password
                   </Label>
                   <div className="relative">
                     <Input
                       id="password"
                       type={showPassword ? "text" : "password"}
                       placeholder="Enter your password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="h-11 rounded-lg border-input pr-10 focus-visible:ring-primary"
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                     >
                       {showPassword ? (
                         <EyeOff className="h-[18px] w-[18px]" />
                       ) : (
                         <Eye className="h-[18px] w-[18px]" />
                       )}
                     </button>
                   </div>
                 </div>
 
                 {/* Remember Me & Forgot Password */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Checkbox
                       id="remember"
                       checked={rememberMe}
                       onCheckedChange={(checked) => setRememberMe(checked === true)}
                     />
                     <Label
                       htmlFor="remember"
                       className="text-sm text-muted-foreground cursor-pointer"
                     >
                       Remember me
                     </Label>
                   </div>
                   <button
                     type="button"
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                     onClick={() => {
                       toast({
                         title: "Forgot Password",
                         description: "Please contact your administrator.",
                       });
                     }}
                   >
                     Forgot Password
                   </button>
                 </div>
 
                 {/* Sign In Button */}
                 <Button
                   type="submit"
                   disabled={isLoading}
                   className={cn(
                     "w-full h-11 rounded-lg font-medium text-sm",
                     "bg-[#1F2937] hover:bg-[#374151] text-white"
                   )}
                 >
                   {isLoading ? "Signing in..." : "Sign In"}
                 </Button>
               </form>
             </TabsContent>
 
             <TabsContent value="signup">
               <form onSubmit={handleSignUp} className="space-y-5">
                 {/* Full Name Field */}
                 <div className="space-y-2">
                   <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                     Full Name
                   </Label>
                   <Input
                     id="fullName"
                     type="text"
                     placeholder="Enter your full name"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="h-11 rounded-lg border-input focus-visible:ring-primary"
                     required
                   />
                 </div>
 
                 {/* Email Field */}
                 <div className="space-y-2">
                   <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                     Email
                   </Label>
                   <Input
                     id="signup-email"
                     type="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="h-11 rounded-lg border-input focus-visible:ring-primary"
                     required
                   />
                 </div>
 
                 {/* Password Field */}
                 <div className="space-y-2">
                   <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                     Password
                   </Label>
                   <div className="relative">
                     <Input
                       id="signup-password"
                       type={showPassword ? "text" : "password"}
                       placeholder="Min 8 characters"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="h-11 rounded-lg border-input pr-10 focus-visible:ring-primary"
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                     >
                       {showPassword ? (
                         <EyeOff className="h-[18px] w-[18px]" />
                       ) : (
                         <Eye className="h-[18px] w-[18px]" />
                       )}
                     </button>
                   </div>
                 </div>
 
                 {/* Confirm Password Field */}
                 <div className="space-y-2">
                   <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                     Confirm Password
                   </Label>
                   <Input
                     id="confirmPassword"
                     type="password"
                     placeholder="Confirm your password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="h-11 rounded-lg border-input focus-visible:ring-primary"
                     required
                   />
                 </div>
 
                 {/* Info note */}
                 <p className="text-xs text-muted-foreground">
                   First user will be assigned Admin role automatically.
                 </p>
 
                 {/* Sign Up Button */}
                 <Button
                   type="submit"
                   disabled={isLoading}
                   className={cn(
                     "w-full h-11 rounded-lg font-medium text-sm",
                     "bg-[#1F2937] hover:bg-[#374151] text-white"
                   )}
                 >
                   {isLoading ? "Creating account..." : "Create Account"}
                 </Button>
               </form>
             </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
