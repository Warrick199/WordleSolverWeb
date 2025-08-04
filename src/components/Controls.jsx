-import React, { useState } from 'react'
+import React, { useState, useEffect } from 'react'

 export default function Controls({ onNextGuess, onClearAll }) {
-  const [dark, setDark] = useState(false)
+  // initialize from localStorage (default to light)
+  const [dark, setDark] = useState(
+    () => localStorage.getItem('theme') === 'dark'
+  )

+  // on mount, apply the saved theme
+  useEffect(() => {
+    if (dark) {
+      document.documentElement.classList.add('dark')
+    } else {
+      document.documentElement.classList.remove('dark')
+    }
+  }, [dark])

   function toggleTheme() {
-    if (!dark) {
-      document.documentElement.classList.add('dark')
-    } else {
-      document.documentElement.classList.remove('dark')
-    }
-    setDark(!dark)
+    const next = !dark
+    setDark(next)
+    // persist choice
+    localStorage.setItem('theme', next ? 'dark' : 'light')
   }

   return (
     <div className="flex justify-center items-center mt-4 mb-8 space-x-4">
       <button
         onClick={onClearAll}
         className="
           h-8 px-4 text-sm uppercase
           bg-gray-300 dark:bg-gray-700
           text-gray-700 dark:text-gray-200
           rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
           transition
         "
       >
         CLEAR ALL
       </button>

       <button
         onClick={onNextGuess}
         className="
           h-8 px-4 text-sm uppercase
           bg-gray-300 dark:bg-gray-700
           text-gray-700 dark:text-gray-200
           rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
           transition
         "
       >
         NEXT GUESS
       </button>

       <button
         onClick={toggleTheme}
         className="
           h-8 w-8 uppercase
           bg-gray-300 dark:bg-gray-700
           text-gray-700 dark:text-gray-200
           rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
           transition flex items-center justify-center
         "
       >
         {dark ? '🌙' : '☀️'}
       </button>
     </div>
   )
 }
