import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module2.js";


let db = prodb("Productdb", {
  products: `++id,reg,pname,cla,fname,mname,mob`
});
const userid = document.getElementById("userid");
const reg = document.getElementById("reg");
const pname = document.getElementById("pname");
const cla = document.getElementById("cla");
// const sec = document.getElementById("sec");
const fname = document.getElementById("fname");
const mname = document.getElementById("mname");
const mob = document.getElementById("mob");
// const income = document.getElementById("income");
// const address = document.getElementById("address");
// const hsd = document.getElementById("hsd");

const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");
btncreate.onclick = event => {

  let flag = bulkcreate(db.products, {
    reg:reg.value,
    pname: pname.value,
    cla: cla.value,
    // sec: sec.value,
    fname:fname.value,
    mname:mname.value,
    mob:mob.value
    // income:income.value,
    // address:address.value,
    // hsd:hsd.value
  });
  reg.value ="";
  pname.value ="";
  cla.value ="";
  // sec.value ="";
  fname.value ="";
  mname.value ="";
  mob.value ="";
  // income.value ="";
  // address.value ="";
  // hsd.value= "";
  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};
btnread.onclick = table;
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    // call dexie update method
    db.products.update(id, {
    reg:reg.value,
    pname: pname.value,
    cla: cla.value,
    // sec: sec.value,
    fname:fname.value,
    mname:mname.value,
    mob:mob.value
    // income:income.value,
    // address:address.value,
    // hsd:hsd.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);
      reg.value ="";
      pname.value ="";
      cla.value ="";
      // sec.value ="";
      fname.value ="";
       mname.value ="";
      mob.value ="";
      // income.value ="";
      // address.value ="";
      // hsd.value= "";
      console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}
btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `++id,pname,cla,sec,fname,mname,mob,income,address,hsd`
  });
  db.open();
  table();
  textID(userid);
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  textID(userid);
};

function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    reg.value = newdata.reg || "";
    pname.value = newdata.pname || "";
    cla.value = newdata.cla || "";
    // sec.value = newdata.sec || "";
    fname.value = newdata.fname || "";
    mname.value = newdata.mname || "";
    mob.value = newdata.mob || "";
    // income.value = newdata.income || "";
    // address.value = newdata.address || "";
    // hsd.value = newdata.hsd || "";
  });
}
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

function getMsg(flag, element) {
  if (flag) {
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}