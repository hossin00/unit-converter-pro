import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
const AC='#f59e0b';
const CATEGORIES:{[key:string]:{units:string[],base:(v:number,from:number)=>number}} = {
  'Length':{ units:['Millimeter','Centimeter','Meter','Kilometer','Inch','Foot','Yard','Mile'], base:(v,i)=>v*[0.001,0.01,1,1000,0.0254,0.3048,0.9144,1609.34][i] },
  'Weight':{ units:['Milligram','Gram','Kilogram','Tonne','Ounce','Pound','Stone'], base:(v,i)=>v*[0.000001,0.001,1,1000,0.028350,0.453592,6.35029][i] },
  'Temperature':{ units:['Celsius','Fahrenheit','Kelvin'], base:(v,i)=>i===0?v+273.15:i===1?(v-32)*5/9+273.15:v },
  'Volume':{ units:['Milliliter','Liter','Cubic Meter','Teaspoon','Tablespoon','Cup','Pint','Gallon'], base:(v,i)=>v*[0.000001,0.001,1,0.0000049,0.0000148,0.000237,0.000473,0.003785][i] },
  'Speed':{ units:['m/s','km/h','mph','knot','ft/s'], base:(v,i)=>v*[1,0.277778,0.44704,0.514444,0.3048][i] },
  'Area':{ units:['sq cm','sq meter','sq km','sq inch','sq foot','acre','hectare'], base:(v,i)=>v*[0.0001,1,1000000,0.000645,0.0929,4046.86,10000][i] },
  'Time':{ units:['Second','Minute','Hour','Day','Week','Month','Year'], base:(v,i)=>v*[1,60,3600,86400,604800,2592000,31536000][i] },
  'Data':{ units:['Byte','Kilobyte','Megabyte','Gigabyte','Terabyte'], base:(v,i)=>v*[1,1024,1048576,1073741824,1099511627776][i] },
};
export default function App() {
  const [cat,setCat]=useState('Length'); const [fromI,setFromI]=useState(0); const [toI,setToI]=useState(2); const [val,setVal]=useState('');
  const catData=CATEGORIES[cat];
  const convert=()=>{
    const v=parseFloat(val); if(isNaN(v)) return '';
    if(cat==='Temperature'){
      const toBase=(v2:number,i:number)=>i===0?v2+273.15:i===1?(v2-32)*5/9+273.15:v2;
      const fromBase=(v2:number,i:number)=>i===0?v2-273.15:i===1?v2*9/5-459.67:v2;
      const k=toBase(v,fromI); const r=fromBase(k,toI);
      return r.toFixed(6).replace(/\.?0+$/,'');
    }
    const inBase=catData.base(v,fromI);
    const outBase=catData.base(1,toI);
    const r=inBase/outBase;
    if(r>1e6||r<0.0001) return r.toExponential(4);
    return r.toFixed(6).replace(/\.?0+$/,'');
  };
  const result=val?convert():'';
  const inp={width:'100%',background:'#0a0800',border:'1px solid #1a1200',borderRadius:'10px',padding:'12px 14px',color:'white',fontSize:'18px',fontWeight:'600',outline:'none',fontFamily:'Inter'};
  return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1a1200',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${AC},#d97706)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${AC}30`}}><ArrowLeftRight size={16} color="white"/></div>
        <div style={{fontWeight:'700',fontSize:'16px',color:'white'}}>Unit Converter Pro</div>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'14px 20px'}}>
        <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'14px',paddingBottom:'4px'}}>
          {Object.keys(CATEGORIES).map(c=><button key={c} onClick={()=>{setCat(c);setFromI(0);setToI(1);setVal('');}}
            style={{flexShrink:0,padding:'6px 14px',borderRadius:'20px',border:`1px solid ${cat===c?AC:'#1a1200'}`,background:cat===c?AC+'15':'transparent',color:cat===c?'#fcd34d':'#92400e',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',whiteSpace:'nowrap'}}>{c}</button>)}
        </div>
        <div style={{maxWidth:'420px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'12px'}}>
          <div>
            <select value={fromI} onChange={e=>setFromI(+e.target.value)}
              style={{...inp,cursor:'pointer',marginBottom:'8px'}}>
              {catData.units.map((u,i)=><option key={u} value={i}>{u}</option>)}
            </select>
            <input type="number" value={val} onChange={e=>setVal(e.target.value)} placeholder="Enter value"
              style={inp} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#1a1200'}/>
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <button onClick={()=>{setFromI(toI);setToI(fromI);}} style={{padding:'10px',borderRadius:'50%',background:AC+'20',border:`1px solid ${AC}40`,cursor:'pointer',color:AC}}><ArrowLeftRight size={18}/></button>
          </div>
          <div>
            <select value={toI} onChange={e=>setToI(+e.target.value)}
              style={{...inp,cursor:'pointer',marginBottom:'8px'}}>
              {catData.units.map((u,i)=><option key={u} value={i}>{u}</option>)}
            </select>
            <div style={{width:'100%',background:'#1a1200',border:`1px solid ${result?AC+'40':'#1a1200'}`,borderRadius:'10px',padding:'12px 14px',minHeight:'50px',display:'flex',alignItems:'center'}}>
              <span style={{fontSize:'24px',fontWeight:'700',color:AC}}>{result||<span style={{color:'#92400e',fontSize:'16px',fontWeight:'400'}}>Enter a value above</span>}</span>
            </div>
          </div>
          {val&&result&&<div style={{background:'#0a0800',border:'1px solid #1a1200',borderRadius:'12px',padding:'14px'}}>
            <div style={{fontSize:'12px',color:'#92400e',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>All {catData.units.length} {cat} Units</div>
            {catData.units.map((u,i)=>{
              if(i===fromI)return null;
              let r='';
              try{
                const v=parseFloat(val);
                if(cat==='Temperature'){const tB=(v2:number,j:number)=>j===0?v2+273.15:j===1?(v2-32)*5/9+273.15:v2;const fB=(v2:number,j:number)=>j===0?v2-273.15:j===1?v2*9/5-459.67:v2;r=fB(tB(v,fromI),i).toFixed(3).replace(/\.?0+$/,'');}
                else{r=(catData.base(v,fromI)/catData.base(1,i)).toFixed(4).replace(/\.?0+$/,'');}
              }catch{r='?';}
              return <div key={u} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #1a1200'}}>
                <span style={{fontSize:'12px',color:'#92400e'}}>{u}</span>
                <span style={{fontSize:'13px',fontWeight:'600',color:'#fcd34d'}}>{r}</span>
              </div>;
            })}
          </div>}
        </div>
      </div>
    </div>
  );
}