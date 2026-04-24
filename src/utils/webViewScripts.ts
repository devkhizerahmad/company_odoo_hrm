/**
 * Custom JavaScript and CSS injections for Odoo WebViews
 */

export const LOGIN_CSS_INJECTION = `
  (function() {
    var style = document.createElement('style');
    style.innerHTML = \`
      .oe_login_form, .card { 
        margin-top: 15% !important; 
        border-radius: 16px !important; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
        border: none !important;
      }
      body { 
        background-color: #f8fafc !important; 
        display: flex !important; 
        flex-direction: column !important;
      }
      .navbar { display: none !important; }
    \`;
    document.head.appendChild(style);
  })();
  true;
`;

export const HIDE_HEADER_JS = `
  (function() {
    var style = document.createElement('style');
    style.innerHTML = \`
      .o_navbar_apps_menu, 
      .o_menu_toggle, 
      .o_mobile_menu_toggle, 
      .o_main_navbar > a.o_menu_brand { 
        display: none !important; 
      }
      .o_main_navbar {
        background-color: #714B67 !important; /* Standard Odoo Purple */
      }
    \`;
    document.head.appendChild(style);
    
    // Periodically check and hide if it reappears
    setInterval(function() {
      var selectors = [".o_navbar_apps_menu", ".o_menu_toggle", ".o_mobile_menu_toggle"];
      selectors.forEach(function(s) {
        var el = document.querySelector(s);
        if (el) el.style.display = "none";
      });
    }, 500);
  })();
  true;
`;

export const PROFILE_DETECTION_JS = `
  (function() {
    var checkCount = 0;
    function checkSession() {
      checkCount++;
      var uid = (window.odoo && window.odoo.session_info && window.odoo.session_info.uid) || 
                (window.session_info && window.session_info.uid);
      
      if (uid) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SESSION_INFO',
          userId: uid
        }));
      } else if (checkCount < 20) {
        setTimeout(checkSession, 1000);
      }
    }
    checkSession();
  })();
  true;
`;
