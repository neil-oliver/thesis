// cross correlation
let x = [];
let y = [];
let n = y.length;
let delay = 0;
let maxdelay = 1;
   
   /* Calculate the mean of the two series x[], y[] */
   let mx = 0;
   let my = 0;   
   for (i=0;i<n;i++) {
      mx += x[i];
      my += y[i];
   }
   mx /= n;
   my /= n;

   /* Calculate the denominator */
   let sx = 0;
   let sy = 0;
   for (let i=0;i<n;i++) {
      sx += (x[i] - mx) * (x[i] - mx);
      sy += (y[i] - my) * (y[i] - my);
   }
   let denom = sqrt(sx*sy);

   /* Calculate the correlation series */
   for (delay=-maxdelay;delay<maxdelay;delay++) {
      let sxy = 0;
      for (i=0;i<n;i++) {
         let j = i + delay;
         if (j < 0 || j >= n)
            continue;
         else
            sxy += (x[i] - mx) * (y[j] - my);
         /* Or should it be (?)
         if (j < 0 || j >= n)
            sxy += (x[i] - mx) * (-my);
         else
            sxy += (x[i] - mx) * (y[j] - my);
         */
      }
      let r = sxy / denom;
      
      /* r is the correlation coefficient at "delay" */

   }