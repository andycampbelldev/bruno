// stop enter from submitting form
window.addEventListener('keydown', function(e) {
    if(e.keyIdentifier=='U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
      if(e.target.nodeName == 'INPUT'){
        e.preventDefault();
        return false;
      }
    }}, true);
  
  //general toggler for showing/hiding elements
  function toggler(i) {
      $("." + i).toggleClass("d-none");
  }

// show/hide scroll cue on mobile when user scrolls right
const toggleScrollCue = function() {
    let y = this.scrollLeft; 
    let chev = this.querySelector('.scroll-cue');
    if (y > 5) {
      chev.classList.remove('d-flex');
      chev.classList.add('d-none');
    } else {
      chev.classList.remove('d-none');
      chev.classList.add('d-flex');
    }
  }