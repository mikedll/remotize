

The Remotize jQuery plugin makes it simple to attach the 3 standard
javascript handlers to a Rails remote form. It assumes you will render
errors as JSON.

It has a couple of unfulfilled dependencies right now. I should really
put those in.

Features:

  - Disables form elements while ajax request is working
  - Attributes get colored an error class onError
  - The rails full messages get written into the form
  - A hidden spinner will be revealed if you have embedded one in the form.

I used it across projects to spare myself having to rewrite the same old handlers.

    $('#myform').remotize()




