import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, doc, setDoc, db } from '../lib/firebase';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Initialize user in Firestore if they don't exist
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0F1115] border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <LogIn size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-100 mb-2">IPO.PRO</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Halka Arz Takip Platformu</p>
        </div>

        <div className="space-y-6 relative z-10">
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Google ile Giriş Yap
          </button>
          
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex gap-3">
             <ShieldAlert size={20} className="text-emerald-500 shrink-0" />
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
               Giriş yaparak kullanım koşullarını ve verilerinizin güvenli 256-bit SSL şifreleme ile korunduğunu kabul etmiş olursunuz.
             </p>
          </div>
        </div>

        <div className="mt-10 text-center relative z-10">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">ARZPLUS FINANSAL TEKNOLOJILERI</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
