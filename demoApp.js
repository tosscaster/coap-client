"use strict";

var _ = require("busyman"),
  CoapNode = require("coap-node"),
  SmartObject = require("smartobject");

var so1 = new SmartObject(),
  so2 = new SmartObject(),
  so3 = new SmartObject();

var value = {
  temp: function() {
    return (Math.random() * (30 - 25 + 1) + 25).toFixed(1);
  },
  humi: function() {
    return (Math.random() * (55 - 50 + 1) + 50).toFixed(1);
  },
  illu: 87,
  pir: false,
  onOff: false,
  flame: false,
  lightCtrl: false,
  buzzerCtrl: false
};

var demoAppEnabled = false;

/************************/
/* so1 init             */
/************************/
so1.init("temperature", 0, {
  sensorValue: {
    read: function(cb) {
      cb(null, value.temp());
    }
  }
});

so1.init("presence", 0, {
  dInState: {
    read: function(cb) {
      cb(null, value.pir);
    }
  }
});

so1.init("lightCtrl", 0, {
  onOff: {
    read: function(cb) {
      cb(null, value.lightCtrl);
    },
    write: function(val, cb) {
      value.lightCtrl = val;
      cb(null, val);
    }
  }
});

/************************/
/* so2 init             */
/************************/
so2.init("illuminance", 0, {
  sensorValue: {
    read: function(cb) {
      cb(null, value.illu);
    }
  }
});

so2.init("onOffSwitch", 0, {
  dInState: {
    read: function(cb) {
      cb(null, value.onOff);
    }
  }
});

/************************/
/* so3 init             */
/************************/
so3.init("humidity", 0, {
  sensorValue: {
    read: function(cb) {
      cb(null, value.humi());
    }
  }
});

so3.init("buzzer", 0, {
  onOff: {
    read: function(cb) {
      cb(null, value.buzzerCtrl);
    },
    write: function(val, cb) {
      value.buzzerCtrl = val;
      cb(null, val);
    }
  }
});

so3.init("dIn", 0, {
  dInState: {
    read: function(cb) {
      cb(null, value.flame);
    }
  }
});

/************************/
/* cnode init           */
/************************/
var cnode1 = new CoapNode("cnode1", so1),
  cnode2 = new CoapNode("cnode2", so2),
  cnode3 = new CoapNode("cnode3", so3);

//var remoteCnode1, remoteCnode2, remoteCnode3;

function demoApp() {
  if (demoAppEnabled) {
    return true;
  }

  demoAppEnabled = true;

  //
  // Factory Bootstrap
  //
  setTimeout(function() {
    //toastInd('Device node1 will join the network');
    /*
    cnode1.on("bootstrapped", function() {
      console.log("bootstrapped");
      cnode1.registerAllCfg(function(err, rsp) {
        if (err) {
          console.log(err);
        } else {
          console.log(rsp);

          setInterval(function() {
            cnode1.so.read(
              "temperature",
              0,
              "sensorValue",
              undefined,
              function() {}
            );
          }, 3000);

          setInterval(function() {
            cnode1.so.read(
              "presence",
              0,
              "dInState",
              undefined,
              function() {}
            );
          }, 1000);
        }
      });
    });

    cnode1.on("registered", function() {
      console.log("registered");
    });

    cnode1.on("deregistered", function(msg) {
      console.log("deregistered");
    });

    cnode1.on("offline", function(msg) {
      console.log("offline");
    });

    cnode1.on("reconnect", function(msg) {
      console.log("reconnect");
    });

    cnode1.on("error", function(err) {
      console.log(err);
    });

    console.log("call bootstrap ---------------");
    cnode1.bootstrap("127.0.0.1", 5783, function(err, rsp) {
      console.log(rsp);
    });
    */

    setTimeout(function() {
      cnode1.registerAllCfg(function(err, rsp) {
        console.log("cnode1 registerAllCfg ", rsp);
      });
      /*
      cnode1.register("127.0.0.1", 5683, function(err, rsp) {
        if (err) console.log(err);

        setInterval(function() {
          cnode1.so.read(
            "temperature",
            0,
            "sensorValue",
            undefined,
            function() {}
          );
        }, 3000);

        setInterval(function() {
          cnode1.so.read("presence", 0, "dInState", undefined, function() {});
        }, 1000);
      });
      */
    }, 2000);
  }, 100);

  // configure server who you want to register
  cnode1.configure("127.0.0.1", 5683, {
    lifetime: 300
  });

  cnode1.on("error", function(err) {
    console.log(err);
  });

  cnode1.on("registered", function() {
    console.log(">> coap cnode1 node is registered to a server");
    var so = cnode1.getSmartObject();
    //so.read("lwm2mSecurity", function(err, data) {
    //  if (!err) console.log(data); // { '0':
    //   { lwm2mServerURI: 'coap://192.168.1.113:5783',
    //     bootstrapServer: false,
    //     securityMode: 3,
    //     pubKeyId: '',
    //     serverPubKeyId: '',
    //     secretKey: '',
    //     shortServerId: 1 },
    //});

    setInterval(function() {
      cnode1.so.read("temperature", 0, "sensorValue", undefined, function() {});
    }, 3000);

    setInterval(function() {
      cnode1.so.read("presence", 0, "dInState", undefined, function() {});
    }, 1000);
  });

  cnode1.on("login", function() {
    console.log(">> coap cnode1 node logs in the network");
  });

  cnode1.on("logout ", function() {
    console.log(">> coap cnode1 node logs out the network");
  });

  cnode1.on("deregistered", function(msg) {
    console.log("cnode1 deregistered");
  });

  cnode1.on("offline", function(msg) {
    console.log("cnode1 offline");
  });

  cnode1.on("reconnect", function(msg) {
    console.log("cnode1 reconnect");
  });

  cnode1.on("announce", function(msg) {
    console.log("cnode1 announce ", msg);
  });

  cnode1.on("observe", function(msg) {
    console.log("cnode1 observe ", msg);
  });

  //
  // Client Initiated Bootstrap
  //
  setTimeout(function() {
    //toastInd('Device node2 will join the network');

    setTimeout(function() {
      cnode2.register("127.0.0.1", 5683, function(err, rsp) {
        if (err) console.log(err);
        // setInterval(function() {
        //   cnode2.so.read(
        //     "illuminance",
        //     0,
        //     "sensorValue",
        //     undefined,
        //     function() {}
        //   );
        //   cnode2.so.read(
        //     "onOffSwitch",
        //     0,
        //     "dInState",
        //     undefined,
        //     function() {}
        //   );
        // }, 1000);
      });
    }, 2000);
  }, 3500);

  cnode2.on("error", function(err) {
    console.log(err);
  });

  cnode2.on("registered", function() {
    console.log(">> coap cnode2 node is registered to a server");
    var so = cnode2.getSmartObject();
    setInterval(function() {
      cnode2.so.read("illuminance", 0, "sensorValue", undefined, function() {});
      cnode2.so.read("onOffSwitch", 0, "dInState", undefined, function() {});
    }, 1000);
  });

  cnode2.on("login", function() {
    console.log(">> coap cnode2 node logs in the network");
  });

  cnode2.on("logout ", function() {
    console.log(">> coap cnode2 node logs out the network");
  });

  cnode2.on("deregistered", function(msg) {
    console.log("cnode2 deregistered");
  });

  cnode2.on("offline", function(msg) {
    console.log("cnode2 offline");
  });

  cnode2.on("reconnect", function(msg) {
    console.log("cnode2 reconnect");
  });

  cnode2.on("announce", function(msg) {
    console.log("cnode2 announce ", msg);
  });

  cnode2.on("observe", function(msg) {
    console.log("cnode2 observe ", msg);
  });

  cnode2.on("bootstrapped", function() {
    // If the bootstrap procedure completes successfully, 'bootstrapped' will be fired
    console.log("bootstrapped");
    // after bootstrapped, you can register to all the servers that have been configured by Bootstrap Server
    cnode2.registerAllCfg(function(err, rsp) {
      if (err) console.log(err);
      else {
        console.log("cnode2 registerAllCfg ", rsp); // { status: '2.01', data: xxxx }
      }
    });
  });

  // bootstrap to a Bootstrap Server with its ip and port
  //cnode2.bootstrap("127.0.0.1", 5783, function(err, rsp) {
  //  console.log(rsp); // { status: '2.04' }
  //});

  //------------------------------------------------------
  setTimeout(function() {
    //toastInd('Device node3 will join the network');

    setTimeout(function() {
      cnode3.register("127.0.0.1", 5683, function(err, rsp) {
        if (err) console.log(err);

        setInterval(function() {
          cnode3.so.read(
            "humidity",
            0,
            "sensorValue",
            undefined,
            function() {}
          );
        }, 3000);

        setInterval(function() {
          cnode3.so.read("dIn", 0, "dInState", undefined, function() {});
        }, 1000);
      });
    }, 2000);
  }, 7000);

  cnode3.on("error", function(err) {
    console.log(err);
  });

  cnode3.on("registered", function() {
    console.log(">> coap cnode3 node is registered to a server");
    var so = cnode3.getSmartObject();
  });

  cnode3.on("login", function() {
    console.log(">> coap cnode3 node logs in the network");
  });

  cnode3.on("logout ", function() {
    console.log(">> coap cnode3 node logs out the network");
  });

  cnode3.on("deregistered", function(msg) {
    console.log("cnode3 deregistered");
  });

  cnode3.on("offline", function(msg) {
    console.log("cnode3 offline");
  });

  cnode3.on("reconnect", function(msg) {
    console.log("cnode3 reconnect");
  });

  cnode3.on("announce", function(msg) {
    console.log("cnode3 announce ", msg);
  });

  cnode3.on("observe", function(msg) {
    console.log("cnode3 observe ", msg);
  });

  setTimeout(function() {
    //toastInd('You can click on a lamp or a buzzer');
  }, 11000);

  setTimeout(function() {
    //toastInd('User will turn on the light switch');
    setTimeout(function() {
      value.onOff = true;
    }, 3000);

    setTimeout(function() {
      //toastInd('User will turn off the light switch');
    }, 6000);

    setTimeout(function() {
      value.onOff = false;
    }, 9000);
  }, 17000);

  setTimeout(function() {
    //toastInd('Illumination is less than 50 lux, light would be turned on');
    setTimeout(function() {
      value.illu = 32;
    }, 3000);

    setTimeout(function() {
      //toastInd('Illumination is greater than 50 lux, light would be turned off');
    }, 6000);

    setTimeout(function() {
      value.illu = 108;
    }, 9000);
  }, 29000);

  setTimeout(function() {
    //toastInd('PIR sensed someone walking around, light would be turned on');
    setTimeout(function() {
      value.pir = true;
    }, 3000);

    setTimeout(function() {
      value.pir = false;
    }, 9000);
  }, 41000);

  setTimeout(function() {
    //toastInd('Flame sensor detect the presence of a flame, buzzer would be turned on');
    setTimeout(function() {
      value.flame = true;
    }, 3000);

    setTimeout(function() {
      value.flame = false;
    }, 9000);
  }, 53000);

  //setTimeout(function() {
  //  demoAppEnabled = false;
  //}, 59500);
}

module.exports = demoApp;
