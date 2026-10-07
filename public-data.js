(function(){
  const cfg=window.SUPABASE_CONFIG||{};
  const hasSupabase=!!(cfg.url&&cfg.anonKey&&window.supabase);
  window.PortfolioData={
    async load(){
      if(!hasSupabase) return window.PORTFOLIO_DEFAULT;
      try{
        const client=window.supabase.createClient(cfg.url,cfg.anonKey);
        const {data,error}=await client.from('site_revisions').select('content').eq('status','published').order('published_at',{ascending:false}).limit(1).maybeSingle();
        if(error||!data?.content) return window.PORTFOLIO_DEFAULT;
        return Object.assign({},window.PORTFOLIO_DEFAULT,data.content);
      }catch(e){ console.warn('Supabase content unavailable; using local content.',e); return window.PORTFOLIO_DEFAULT; }
    }
  };
})();
