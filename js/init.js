import { $ } from "./jquery"

//初始数据
const iniData = {
    Empty : [],
    R1 : [
        { partType: "resistance", id: "R_in", input: ["10k"], position: [420,280], rotate:[[0,1],[-1,0]] }
    ],
    R2 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [420,340], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_2", input: ["10k"], position: [700,340], rotate:[[1,0],[0,1]] }
    ],
    R2W1 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [420,340], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_2", input: ["10k"], position: [700,240], rotate:[[1,0],[0,1]] },
        { partType: "line", way: [[460,340],[540,340],[540,300],[560,300],[560,240],[660,240]] }
    ],
    R3W2 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [420,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_2", input: ["10k"], position: [640,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_3", input: ["10k"], position: [860,240], rotate:[[1,0],[0,1]] },
        { partType: "line", way: [[460,240],[600,240]] },
        { partType: "line", way: [[680,240],[820,240]] }
    ],
    R3W3 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [220,340], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_2", input: ["10k"], position: [500,340], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_3", input: ["10k"], position: [500,220], rotate:[[1,0],[0,1]] },
        { partType: "line", way: [[460,220],[360,220],[360,340]] },
        { partType: "line", way: [[260,340],[360,340]] },
        { partType: "line", way: [[360,340],[460,340]] }
    ],
    R4W4 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [400,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_2", input: ["10k"], position: [760,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_3", input: ["10k"], position: [580,120], rotate:[[0,1],[-1,0]] },
        { partType: "resistance", id: "R_4", input: ["10k"], position: [760,400], rotate:[[1,0],[0,1]] },
        { partType: "line", way: [[440,240],[580,240]] },
        { partType: "line", way: [[580,240],[720,240]] },
        { partType: "line", way: [[580,160],[580,240]] },
        { partType: "line", way: [[580,240],[580,300],[640,300],[640,360],[680,360],[680,400],[720,400]] }
    ],
    R9 : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [360,60], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [200,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [300,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [400,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [500,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [600,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [700,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [800,240], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_1", input: ["10k"], position: [900,240], rotate:[[1,0],[0,1]] }
    ],
    Series : [
        { partType: "resistance", id: "R_1", position: [700,160], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["1k"]},
        { partType: "resistance", id: "R_2", position: [700,320], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["1k"]},
        { partType: "reference_ground", id: "GND_1", position: [500,420], rotate: [[1,0],[0,1]]},
        { partType: "voltage_meter", id: "V_R1", position: [780,160], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "dc_current_source", id: "V_1", position: [500,180], rotate: [[1,0],[0,1]], text: [20,-2], input: ["10m"]},
        { partType: "dc_voltage_source", id: "V_2", position: [500,300], rotate: [[1,0],[0,1]], text: [20,-2], input: ["12"]},
        { partType: "current_meter", id: "I_in", position: [600,100], rotate: [[1,0],[0,1]], text: [-9.5,-11]},
        { partType: "line", way:[[700,120],[700,100]] },
        { partType: "line", way:[[780,200],[780,220],[700,220]] },
        { partType: "line", way:[[700,200],[700,220]] },
        { partType: "line", way:[[700,220],[700,280]] },
        { partType: "line", way:[[500,400],[500,380]] },
        { partType: "line", way:[[500,140],[500,100],[580,100]] },
        { partType: "line", way:[[620,100],[700,100]] },
        { partType: "line", way:[[700,100],[780,100],[780,120]] },
        { partType: "line", way:[[500,340],[500,380]] },
        { partType: "line", way:[[500,380],[700,380],[700,360]] },
        { partType: "line", way:[[500,260],[500,220]] }
    ],
    Bridge : [
        { partType: "resistance", id: "R_1", input: ["10k"], position: [460,180], rotate:[[0,1],[-1,0]] },
        { partType: "resistance", id: "R_2", input: ["5k"], position: [460,380], rotate:[[0,1],[-1,0]] },
        { partType: "resistance", id: "R_3", input: ["1k"], position: [560,280], rotate:[[1,0],[0,1]] },
        { partType: "resistance", id: "R_4", input: ["5k"], position: [660,180], rotate:[[0,1],[-1,0]] },
        { partType: "resistance", id: "R_5", input: ["10k"], position: [660,380], rotate:[[0,1],[-1,0]] },
        { partType: "ac_voltage_source", id: "V_1", input: ["50","50","0","0"], position: [340,280], rotate:[[1,0],[0,1]] },
        { partType: "voltage_meter", id: "V_R4", position: [760,180], rotate:[[1,0],[0,1]] },
        { partType: "current_meter", id: "I_R4", position: [560,100], rotate:[[1,0],[0,1]] },
        { partType: "reference_ground", id: "GND_1", position: [340,500], rotate:[[1,0],[0,1]] },
        { partType: "line", way:[[340,240],[340,100],[460,100]] },
        { partType: "line", way:[[660,140],[660,100]] },
        { partType: "line", way:[[460,100],[460,140]] },
        { partType: "line", way:[[340,320],[340,460]] },
        { partType: "line", way:[[660,420],[660,460],[460,460]] },
        { partType: "line", way:[[460,460],[460,420]] },
        { partType: "line", way:[[460,220],[460,280]] },
        { partType: "line", way:[[660,220],[660,280]] },
        { partType: "line", way:[[520,280],[460,280]] },
        { partType: "line", way:[[460,280],[460,340]] },
        { partType: "line", way:[[600,280],[660,280]] },
        { partType: "line", way:[[660,280],[660,340]] },
        { partType: "line", way:[[460,100],[540,100]] },
        { partType: "line", way:[[760,220],[760,280],[660,280]] },
        { partType: "line", way:[[340,480],[340,460]] },
        { partType: "line", way:[[340,460],[460,460]] },
        { partType: "line", way:[[580,100],[660,100]] },
        { partType: "line", way:[[660,100],[760,100],[760,140]] }
    ],
    FirstOrderCircuitDC : [
        { partType: "dc_voltage_source", id: "V_1", position: [180,280], rotate: [[1,0],[0,1]], input: ["10"]},
        { partType: "resistance", id: "R_1", position: [340,200], rotate: [[1,0],[0,1]], input: ["1k"]},
        { partType: "capacitor", id: "C_1", position: [420,280], rotate: [[0,1],[-1,0]], input: ["1u"]},
        { partType: "reference_ground", id: "GND_1", position: [340,400], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[380,200],[420,200]] },
        { partType: "line", way:[[180,240],[180,200],[260,200]] },
        { partType: "line", way:[[180,320],[180,360],[260,360]] },
        { partType: "line", way:[[340,380],[340,360]] },
        { partType: "line", way:[[340,360],[420,360]] },
        { partType: "line", way:[[520,240],[520,200],[420,200]] },
        { partType: "line", way:[[420,240],[420,200]] },
        { partType: "line", way:[[520,320],[520,360],[420,360]] },
        { partType: "line", way:[[420,320],[420,360]] },
        { partType: "line", way:[[260,240],[260,200]] },
        { partType: "line", way:[[260,200],[300,200]] },
        { partType: "line", way:[[260,320],[260,360]] },
        { partType: "line", way:[[260,360],[340,360]] },
        { partType: "voltage_meter", id: "V_in", position: [260,280], rotate: [[1,0],[0,1]]},
        { partType: "voltage_meter", id: "V_C1", position: [520,280], rotate: [[1,0],[0,1]]}
    ],
    FirstOrderCircuitAC : [
        { partType: "resistance", id: "R_1", position: [340,200], rotate: [[1,0],[0,1]], input: ["200"]},
        { partType: "capacitor", id: "C_1", position: [420,280], rotate: [[0,1],[-1,0]], input: ["10u"]},
        { partType: "reference_ground", id: "GND_1", position: [340,400], rotate: [[1,0],[0,1]]},
        { partType: "voltage_meter", id: "V_in", position: [260,280], rotate: [[1,0],[0,1]]},
        { partType: "voltage_meter", id: "V_C1", position: [520,280], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[380,200],[420,200]] },
        { partType: "line", way:[[340,380],[340,360]] },
        { partType: "line", way:[[340,360],[420,360]] },
        { partType: "line", way:[[520,240],[520,200],[420,200]] },
        { partType: "line", way:[[420,240],[420,200]] },
        { partType: "line", way:[[520,320],[520,360],[420,360]] },
        { partType: "line", way:[[420,320],[420,360]] },
        { partType: "line", way:[[260,240],[260,200]] },
        { partType: "line", way:[[260,320],[260,360]] },
        { partType: "ac_voltage_source", id: "V_1", position: [160,280], rotate: [[1,0],[0,1]], input: ["20","100","0","0"]},
        { partType: "line", way:[[160,240],[160,200],[260,200]] },
        { partType: "line", way:[[260,200],[300,200]] },
        { partType: "line", way:[[160,320],[160,360],[260,360]] },
        { partType: "line", way:[[260,360],[340,360]] }
    ],
    BridgeRectifier : [
        { partType: "diode", id: "VD_1", position: [300,200], rotate: [[1,0],[0,1]], text: [18,6], input: ["1","0.5","0.2G"]},
        { partType: "diode", id: "VD_2", position: [380,200], rotate: [[1,0],[0,1]], text: [18,6], input: ["1","0.5","0.2G"]},
        { partType: "diode", id: "VD_3", position: [300,440], rotate: [[1,0],[0,1]], text: [18,6], input: ["1","0.5","0.2G"]},
        { partType: "diode", id: "VD_4", position: [380,440], rotate: [[1,0],[0,1]], text: [18,6], input: ["1","0.5","0.2G"]},
        { partType: "ac_voltage_source", id: "V_1", position: [180,320], rotate: [[1,0],[0,1]], text: [-38,-10], input: ["220","200","0","0"]},
        { partType: "capacitor", id: "C_1", position: [500,320], rotate: [[0,1],[-1,0]], text: [-36,-2], input: ["100u"]},
        { partType: "resistance", id: "R_1", position: [560,320], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["2k"]},
        { partType: "current_meter", id: "I_out", position: [440,140], rotate: [[1,0],[0,1]], text: [-12,-11]},
        { partType: "voltage_meter", id: "V_out", position: [640,320], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "voltage_meter", id: "V_in", position: [240,320], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "reference_ground", id: "GND_1", position: [300,540], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[180,280],[180,260],[240,260]] },
        { partType: "line", way:[[180,360],[180,380],[240,380]] },
        { partType: "line", way:[[300,160],[300,140],[380,140]] },
        { partType: "line", way:[[640,280],[640,140],[560,140]] },
        { partType: "line", way:[[640,360],[640,500],[560,500]] },
        { partType: "line", way:[[380,240],[380,380]] },
        { partType: "line", way:[[380,380],[380,400]] },
        { partType: "line", way:[[300,400],[300,260]] },
        { partType: "line", way:[[300,260],[300,240]] },
        { partType: "line", way:[[560,280],[560,140]] },
        { partType: "line", way:[[380,480],[380,500]] },
        { partType: "line", way:[[300,480],[300,500]] },
        { partType: "line", way:[[380,500],[500,500]] },
        { partType: "line", way:[[560,360],[560,500]] },
        { partType: "line", way:[[500,360],[500,500]] },
        { partType: "line", way:[[460,140],[500,140]] },
        { partType: "line", way:[[500,280],[500,140]] },
        { partType: "line", way:[[420,140],[380,140]] },
        { partType: "line", way:[[380,140],[380,160]] },
        { partType: "line", way:[[560,140],[500,140]] },
        { partType: "line", way:[[560,500],[500,500]] },
        { partType: "line", way:[[240,280],[240,260]] },
        { partType: "line", way:[[240,260],[300,260]] },
        { partType: "line", way:[[240,360],[240,380]] },
        { partType: "line", way:[[240,380],[380,380]] },
        { partType: "line", way:[[300,520],[300,500]] },
        { partType: "line", way:[[300,500],[380,500]] }
    ],
    halfWaveRectifier : [
        { partType: "ac_voltage_source", id: "V_1", position: [180,220], rotate: [[1,0],[0,1]], text: [-38,-10], input: ["20","200","0","0"]},
        { partType: "diode", id: "VD_1", position: [280,140], rotate: [[0,1],[-1,0]], text: [-11.5,-18], input: ["1","0.5","0.2G"]},
        { partType: "resistance", id: "R_1", position: [460,220], rotate: [[0,1],[-1,0]], text: [-30,-2], input: ["100"]},
        { partType: "line", way:[[180,180],[180,140],[240,140]] },
        { partType: "line", way:[[320,140],[380,140]] },
        { partType: "line", way:[[420,140],[460,140]] },
        { partType: "line", way:[[520,180],[520,140],[460,140]] },
        { partType: "line", way:[[460,140],[460,180]] },
        { partType: "line", way:[[180,260],[180,300],[320,300]] },
        { partType: "reference_ground", id: "GND_1", position: [320,340], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[320,320],[320,300]] },
        { partType: "line", way:[[320,300],[460,300]] },
        { partType: "line", way:[[520,260],[520,300],[460,300]] },
        { partType: "line", way:[[460,300],[460,260]] },
        { partType: "current_meter", id: "I_out", position: [400,140], rotate: [[1,0],[0,1]], text: [-12,-11]},
        { partType: "voltage_meter", id: "V_out", position: [520,220], rotate: [[1,0],[0,1]], text: [24,6]}
    ],
    PhaseAmplifier : [
        { partType: "ac_voltage_source", id: "V_1", position: [260,240], rotate: [[0,1],[-1,0]], text: [-7,34], input: ["10","200","0","0"]},
        { partType: "operational_amplifier", id: "OP_1", position: [500,220], rotate: [[1,0],[0,1]], text: [-11.5,0], input: ["120","80M","40"]},
        { partType: "resistance", id: "R_1", position: [380,240], rotate: [[1,0],[0,1]], text: [-7,26], input: ["10k"]},
        { partType: "reference_ground", id: "GND_1", position: [160,240], rotate: [[0,1],[-1,0]]},
        { partType: "voltage_meter", id: "V_in", position: [320,320], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "reference_ground", id: "GND_2", position: [320,420], rotate: [[1,0],[0,1]]},
        { partType: "resistance", id: "R_2", position: [500,140], rotate: [[1,0],[0,1]], text: [-7,-32], input: ["10k"]},
        { partType: "resistance", id: "R_3", position: [380,200], rotate: [[1,0],[0,1]], text: [-7,-32], input: ["10k"]},
        { partType: "reference_ground", id: "GND_3", position: [300,200], rotate: [[0,1],[-1,0]]},
        { partType: "resistance", id: "R_4", position: [560,320], rotate: [[0,1],[-1,0]], text: [-30,-2], input: ["10k"]},
        { partType: "voltage_meter", id: "V_out", position: [620,320], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "line", way:[[180,240],[220,240]] },
        { partType: "line", way:[[340,240],[320,240]] },
        { partType: "line", way:[[460,240],[420,240]] },
        { partType: "line", way:[[320,280],[320,240]] },
        { partType: "line", way:[[320,240],[300,240]] },
        { partType: "line", way:[[320,400],[320,380]] },
        { partType: "line", way:[[340,200],[320,200]] },
        { partType: "line", way:[[460,200],[440,200]] },
        { partType: "line", way:[[460,140],[440,140],[440,200]] },
        { partType: "line", way:[[440,200],[420,200]] },
        { partType: "line", way:[[540,140],[560,140],[560,220]] },
        { partType: "line", way:[[560,280],[560,220]] },
        { partType: "line", way:[[560,220],[540,220]] },
        { partType: "line", way:[[560,360],[560,380]] },
        { partType: "line", way:[[320,380],[320,360]] },
        { partType: "line", way:[[620,280],[620,220],[560,220]] },
        { partType: "line", way:[[620,360],[620,380],[560,380]] },
        { partType: "line", way:[[560,380],[320,380]] }
    ],
    currentAmplifier : [
        { partType: "dc_voltage_source", id: "V_1", position: [180,280], rotate: [[0,1],[-1,0]], text: [-7,-36], input: ["10"]},
        { partType: "resistance", id: "R_1", position: [300,280], rotate: [[1,0],[0,1]], text: [-7,-32], input: ["10k"]},
        { partType: "transistor_npn", id: "Q_1", position: [480,280], rotate: [[1,0],[0,1]], text: [25,6], input: ["40","26","0.6","1"]},
        { partType: "reference_ground", id: "GND_1", position: [100,280], rotate: [[0,1],[-1,0]]},
        { partType: "resistance", id: "R_2", position: [500,400], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["100"]},
        { partType: "line", way:[[120,280],[140,280]] },
        { partType: "line", way:[[220,280],[240,280]] },
        { partType: "line", way:[[500,360],[500,320]] },
        { partType: "line", way:[[420,280],[460,280]] },
        { partType: "line", way:[[380,280],[340,280]] },
        { partType: "current_meter", id: "I_in", position: [400,280], rotate: [[1,0],[0,1]], text: [-9.5,-11]},
        { partType: "current_meter", id: "I_ap", position: [340,200], rotate: [[1,0],[0,1]], text: [-9.5,-11]},
        { partType: "line", way:[[360,200],[500,200],[500,240]] },
        { partType: "line", way:[[320,200],[240,200],[240,280]] },
        { partType: "line", way:[[240,280],[260,280]] },
        { partType: "reference_ground", id: "GND_2", position: [500,480], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[500,440],[500,460]] }
    ],
    CommonEmitterAmplifier : [
        { partType: "config", endtime: "50m", stepsize : "10u"},
        { partType: "dc_voltage_source", id: "V_1", position: [220,100], rotate: [[0,1],[-1,0]], text: [-7,-36], input: ["20"]},
        { partType: "reference_ground", id: "GND_1", position: [140,100], rotate: [[0,1],[-1,0]]},
        { partType: "resistance", id: "R_1", position: [300,180], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["100k"]},
        { partType: "resistance", id: "R_2", position: [300,380], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["100k"]},
        { partType: "resistance", id: "R_3", position: [400,160], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["10k"]},
        { partType: "resistance", id: "R_4", position: [400,400], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["2k"]},
        { partType: "transistor_npn", id: "Q_1", position: [380,280], rotate: [[1,0],[0,1]], text: [25,6], input: ["40","26","0.6","1"]},
        { partType: "resistance", id: "R_5", position: [600,340], rotate: [[0,1],[-1,0]], text: [-30,-2], input: ["1M"]},
        { partType: "capacitor", id: "C_1", position: [500,220], rotate: [[1,0],[0,1]], text: [-7,32], input: ["10n"]},
        { partType: "capacitor", id: "C_2", position: [240,280], rotate: [[1,0],[0,1]], text: [-7,-38], input: ["10μ"]},
        { partType: "ac_voltage_source", id: "V_2", position: [120,360], rotate: [[1,0],[0,1]], text: [-38,-10], input: ["3","300","0","0"]},
        { partType: "voltage_meter", id: "V_in", position: [180,360], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "voltage_meter", id: "V_out", position: [660,340], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "reference_ground", id: "GND_2", position: [120,500], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[160,100],[180,100]] },
        { partType: "line", way:[[260,100],[300,100]] },
        { partType: "line", way:[[400,120],[400,100],[300,100]] },
        { partType: "line", way:[[300,140],[300,100]] },
        { partType: "line", way:[[400,240],[400,220]] },
        { partType: "line", way:[[400,320],[400,360]] },
        { partType: "line", way:[[300,220],[300,280]] },
        { partType: "line", way:[[300,340],[300,280]] },
        { partType: "line", way:[[300,280],[360,280]] },
        { partType: "line", way:[[540,220],[600,220]] },
        { partType: "line", way:[[660,300],[660,220],[600,220]] },
        { partType: "line", way:[[600,220],[600,300]] },
        { partType: "line", way:[[460,220],[400,220]] },
        { partType: "line", way:[[400,220],[400,200]] },
        { partType: "line", way:[[280,280],[300,280]] },
        { partType: "line", way:[[180,320],[180,280]] },
        { partType: "line", way:[[120,320],[120,280],[180,280]] },
        { partType: "line", way:[[180,280],[200,280]] },
        { partType: "line", way:[[120,480],[120,460]] },
        { partType: "line", way:[[180,400],[180,460]] },
        { partType: "line", way:[[120,400],[120,460]] },
        { partType: "line", way:[[300,420],[300,460]] },
        { partType: "line", way:[[180,460],[120,460]] },
        { partType: "line", way:[[400,440],[400,460]] },
        { partType: "line", way:[[300,460],[180,460]] },
        { partType: "line", way:[[600,380],[600,460]] },
        { partType: "line", way:[[400,460],[300,460]] },
        { partType: "line", way:[[660,380],[660,460],[600,460]] },
        { partType: "line", way:[[600,460],[400,460]] }
    ],
    EmitterFollower : [
        { partType: "config", endtime: "40m", stepsize : "5u" },
        { partType: "dc_voltage_source", id: "V_1", position: [220,100], rotate: [[0,1],[-1,0]], text: [-7,-36], input: ["20"] },
        { partType: "reference_ground", id: "GND_1", position: [140,100], rotate: [[0,1],[-1,0]] },
        { partType: "resistance", id: "R_1", position: [300,180], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["10k"] },
        { partType: "resistance", id: "R_2", position: [300,380], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["10k"] },
        { partType: "resistance", id: "R_4", position: [400,400], rotate: [[0,1],[-1,0]], text: [16,-2], input: ["680"] },
        { partType: "transistor_npn", id: "Q_1", position: [380,280], rotate: [[1,0],[0,1]], text: [25,6], input: ["40","26","0.6","1"] },
        { partType: "resistance", id: "R_5", position: [600,400], rotate: [[0,1],[-1,0]], text: [-30,-2], input: ["100k"] },
        { partType: "capacitor", id: "C_1", position: [500,340], rotate: [[1,0],[0,1]], text: [-7,-38], input: ["10n"] },
        { partType: "capacitor", id: "C_2", position: [240,280], rotate: [[1,0],[0,1]], text: [-7,-38], input: ["10μ"] },
        { partType: "ac_voltage_source", id: "V_2", position: [120,360], rotate: [[1,0],[0,1]], text: [-38,-10], input: ["3","1k","0","0"] },
        { partType: "voltage_meter", id: "V_in", position: [180,360], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "voltage_meter", id: "V_out", position: [660,400], rotate: [[1,0],[0,1]], text: [24,6]},
        { partType: "reference_ground", id: "GND_2", position: [120,500], rotate: [[1,0],[0,1]]},
        { partType: "line", way:[[160,100],[180,100]] },
        { partType: "line", way:[[260,100],[300,100]] },
        { partType: "line", way:[[400,320],[400,340]] },
        { partType: "line", way:[[300,220],[300,280]] },
        { partType: "line", way:[[300,340],[300,280]] },
        { partType: "line", way:[[300,280],[360,280]] },
        { partType: "line", way:[[280,280],[300,280]] },
        { partType: "line", way:[[180,320],[180,280]] },
        { partType: "line", way:[[120,320],[120,280],[180,280]] },
        { partType: "line", way:[[180,280],[200,280]] },
        { partType: "line", way:[[120,480],[120,460]] },
        { partType: "line", way:[[180,400],[180,460]] },
        { partType: "line", way:[[120,400],[120,460]] },
        { partType: "line", way:[[300,420],[300,460]] },
        { partType: "line", way:[[180,460],[120,460]] },
        { partType: "line", way:[[400,440],[400,460]] },
        { partType: "line", way:[[300,460],[180,460]] },
        { partType: "line", way:[[600,440],[600,460]] },
        { partType: "line", way:[[400,460],[300,460]] },
        { partType: "line", way:[[660,440],[660,460],[600,460]] },
        { partType: "line", way:[[600,460],[400,460]] },
        { partType: "line", way:[[400,240],[400,100],[300,100]] },
        { partType: "line", way:[[300,100],[300,140]] },
        { partType: "line", way:[[540,340],[600,340]] },
        { partType: "line", way:[[660,360],[660,340],[600,340]] },
        { partType: "line", way:[[600,340],[600,360]] },
        { partType: "line", way:[[460,340],[400,340]] },
        { partType: "line", way:[[400,340],[400,360]] }
    ]
};
//SVG的命名空间
const SVG_NS = "http://www.w3.org/2000/svg";

//扩展对象，将fromObj的所有属性添加到this中（并非复制）
//this和fromObj的原型链都不改变
//不可枚举属性不添加，__proto__内部属性不添加
//扩展属性已经存在的，将会覆盖原有属性
Object.prototype.extend = function(fromObj) {
    //输入并不是对象，直接返回
    if(!(fromObj instanceof Object)) {
        return(this);
    }
    for(let i in fromObj) {
        if(fromObj.hasOwnProperty(i)) {
            this[i] = fromObj[i];
        }
    }
    return(this);
};
Object.prototype.extend({
    //对象是否相等
    isEqual(obj) {
        const thisKeys = Object.keys(this),
            fromKeys = Object.keys(obj);

        if (!thisKeys.isEqual(fromKeys)) {
            return (false);
        }

        for (let i = 0; i < thisKeys.length; i++) {
            if (this[thisKeys[i]] instanceof Object) {
                if (!this[thisKeys[i]].isEqual(obj[thisKeys[i]])) {
                    return (false);
                }
            } else {
                if (this[thisKeys[i]] !== obj[thisKeys[i]]) {
                    return (false);
                }
            }
        }
        return (true);
    }
});
//原生对象扩展
Array.extend({
    //数组深复制，需要避免循环引用
    clone(arr, factor = 1) {
        const ans = [];
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] instanceof Array) {
                ans[i] = Array.clone(arr[i], factor);
            }
            else if(arr[i] instanceof Object) {
                ans[i] = Object.clone(arr[i]);
            }
            else if(typeof arr[i] === "number") {
                ans[i] = arr[i] * factor;
            }
            else {
                ans[i] = arr[i];
            }
        }
        return(ans);
    }
});
Array.prototype.extend({
    //数组是否相等
    isEqual(b) {
        if (!b) {
            return (false);
        }
        if (this.length !== b.length) {
            return (false);
        }
        for (let i = 0; i < this.length; i++) {
            if (this[i] instanceof Object) {
                if (!this[i].isEqual(b[i])) {
                    return(false);
                }
            } else {
                if (this[i] !== b[i]) {
                    return (false);
                }
            }
        }
        return (true);
    },
    //取出下标为index的元素
    get (index) {
        const sub = (index >= 0) ?
            index : (this.length + index);

        if(index >= 0 || index < this.length) {
            return(this[sub]);
        } else {
            return(false);
        }
    }
});
Object.extend({
    //深度复制对象，需要避免循环引用
    clone(fromObj) {
        const toObj = {};
        for(let i in fromObj) {
            if(fromObj.hasOwnProperty(i)) {
                if (fromObj[i] instanceof Array) {
                    toObj[i] = Array.clone(fromObj[i]);
                }
                else if (fromObj[i] instanceof Object) {
                    toObj[i] = Object.clone(fromObj[i]);
                }
                else {
                    toObj[i] = fromObj[i];
                }
            }
        }
        Object.setPrototypeOf(toObj, Object.getPrototypeOf(fromObj));
        return(toObj);
    },
    //对象是否为空
    isEmpty(fromObj) {
        for(let i in fromObj) {
            if (fromObj.hasOwnProperty(i)) {
                return (false);
            }
        }
        return(true);
    },
    //冻结当前对象以及当前对象下属的全部对象
    freezeAll(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (typeof obj[i] === "object") {
                    Object.freezeAll(obj[i]);
                }
            }
        }
        Object.freeze(obj);
    },
    //将当前对象下属可枚举的属性全部调整为隐藏和只读
    freezeMethod(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                Object.defineProperty(obj, i, {
                    configurable: false,
                    writable: false,
                    enumerable: false
                });
            }
        }
    },
    //封闭当前对象以及当前对象下属的所有对象属性
    sealAll(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (typeof obj[i] === "object") {
                    Object.sealAll(obj[i]);
                }
            }
        }
        Object.seal(obj);
    }
});
Math.extend({
    //数组的最大值
    maxOfArray(arr) {
        let ans = -Infinity;
        for (let i = 0; i < arr.length; i++) {
            const num = Number(arr[i]);
            if (!Number.isNaN(num) && num > ans) {
                ans = num;
            }
        }
        return (ans);
    },
    //数组的最小值
    minOfArray(arr) {
        let ans = Infinity;
        for (let i = 0; i < arr.length; i++) {
            const num = Number(arr[i]);
            if (!Number.isNaN(num) && num < ans) {
                ans = num;
            }
        }
        return (ans);
    },
    //求平均数
    average(arr) {
        let ans = 0;
        for(let i = 0; i < arr.length; i++) {
            ans += arr[i];
        }
        return(ans /= arr.length);
    }
});
Number.prototype.extend({
    // 保留效数字，默认6位有效数字
    toSFixed(rank = 6) {
        const num = Number(this.toString());
        if(!num) { return(0); }

        const sign = num / Math.abs(num),
            number = num * sign,
            index = rank - 1 - Math.floor(Math.log10(number));

        let ans;
        if (index > 0) {
            ans = parseFloat(number.toFixed(index));
        } else if (index < 0) {
            const temp = Math.pow(10, index);
            ans = Math.round(number / temp) * temp;
        } else {
            ans = Math.round(number);
        }
        return (ans * sign);
    },
    // 数字转换为缩写字符串，默认保留6位有效数字
    // 数字小于10^-12以及大于10^9的时候，保留6位小数
    toShort(save = 6) {
        const number = Number(this.toString());
        if(!number) { return("0"); }

        const sign = number / Math.abs(number),
            unitS = ["m", "μ", "n", "p"],
            unitL = ["k", "M", "G"];

        let sub = -1, ans, rank = 1,
            uint = number * sign;

        while(uint < 1) {
            rank *= 1000;
            uint *= 1000;
            sub ++;
            if(uint > 1 || sub === 3) {
                ans = (sign * uint).toSFixed(save);
                return({
                    rank: rank,
                    number: ans,
                    unit: unitS[sub],
                    txt: ans + unitS[sub]
                });
            }
        }
        while(uint > 1000) {
            rank *= 0.001;
            uint *= 0.001;
            sub ++;
            if(uint < 1000 || sub === 2) {
                ans = (sign * uint).toSFixed(save);
                return({
                    rank: rank,
                    number: ans,
                    unit: unitL[sub],
                    txt: ans + unitL[sub]
                });
            }
        }
        return({
            rank: 1,
            unit: "",
            number: number.toSFixed(save),
            txt: number.toSFixed(save).toString()
        });
    },
    // 数量级
    rank() {
        const number = Number(this.toString());
        if(!number) { return(0); }

        const sign = number / Math.abs(number);
        return (Math.pow(10, Math.floor(Math.log10(number * sign))));
    },
    // 数字有多少位
    powRank() {
        const number = Number(this.toString());
        if(!number) { return(0); }

        const sign = number / Math.abs(number);
        return (Math.floor(Math.log10(number * sign))) + 1;
    },
    // 单位化
    toUnit() {
        const number = Number(this.toString());

        if (number > 0) {
            return (1);
        } else if (number < 0) {
            return (-1);
        } else {
            return (0);
        }
    }
});
String.prototype.extend({
    // 转换为真实的数值
    toVal() {
        const hash = { G: 1e9, M: 1e6, k: 1e3,
            m: 1e-3, u: 1e-6, n: 1e-9, p: 1e-12 };

        if(this.search(/[dD][bB]$/) !== -1) {
            //db转换
            return (Math.pow(10, parseFloat(this) / 20));
        } else if(this.search(/^update/) !== -1) {
            //有update关键字，字符串保持原样
            return this;
        }

        const input = this.replace("μ", "u"),
            number = parseFloat(input.match(/\d+(.\d+)?/)[0]),
            unit = input.match(/[GMkmunp]/),
            rank = unit ? hash[unit[0]] : 1;

        return((number * rank).toSFixed());
    }
});

//修改部分方法为隐藏以及不可修改
Object.freezeMethod(Array);
Object.freezeMethod(Object);
Object.freezeMethod(Object.prototype);
Object.freezeMethod(Number.prototype);
Object.freezeMethod(String.prototype);

//网页禁止右键和选中
window.document.oncontextmenu = function(){return(false);};

//添加右下角图标
$("#action-container .fab").each((n) => {
    //图标样式
    const icon = {
        "run" : {
            "long" : 1580,
            "transform" : [86,100],
            "d" : "M1384 609l-1328 -738q-23 -13 -39.5 -3t-16.5 36v1472q0 26 " +
            "16.5 36t39.5 -3l1328 -738q23 -13 23 -31t-23 -31z"
        },
        "adds" : {
            "long" : 1408,
            "transform" : [0,0],
            "d" : "M1408 800v-192q0 -40 -28 -68t-68 -28h-416v-416q0 -40 -28 " +
            "-68t-68 -28h-192q-40 0 -68 28t-28 68v416h-416q-40 0 -68 28t-28 " +
            "68v192q0 40 28 68t68 28h416v416q0 40 28 68t68 28h192q40 0 68 " +
            "-28t28 -68v-416h416q40 0 68 -28t28 -68z"
        },
        "config" : {
            "long" : 1920,
            "transform" : [-30, 200],
            "d" : "M896 640q0 106 -75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75t181 " +
            "75t75 181zM1664 128q0 52 -38 90t-90 38t-90 -38t-38 -90q0 -53 37.5 " +
            "-90.5t90.5 -37.5t90.5 37.5t37.5 90.5zM1664 1152q0 52 -38 90t-90 38t-90 " +
            "-38t-38 -90q0 -53 37.5 -90.5t90.5 -37.5 t90.5 37.5t37.5 90.5zM1280 731v-185q0 " +
            "-10 -7 -19.5t-16 -10.5l-155 -24q-11 -35 -32 -76q34 -48 90 -115q7 -10 7 -20q0 " +
            "-12 -7 -19q-23 -30 -82.5 -89.5t-78.5 -59.5q-11 0 -21 7l-115 90q-37 -19 -77 -31q-11 " +
            "-108 -23 -155q-7 -24 -30 -24h-186q-11 0 -20 7.5t-10 17.5 l-23 153q-34 10 -75 " +
            "31l-118 -89q-7 -7 -20 -7q-11 0 -21 8q-144 133 -144 160q0 9 7 19q10 14 41 53t47 " +
            "61q-23 44 -35 82l-152 24q-10 1 -17 9.5t-7 19.5v185q0 10 7 19.5t16 10.5l155 24q11 " +
            "35 32 76q-34 48 -90 115q-7 11 -7 20q0 12 7 20q22 30 82 89t79 59q11 0 21 -7 l115 " +
            "-90q34 18 77 32q11 108 23 154q7 24 30 24h186q11 0 20 -7.5t10 -17.5l23 -153q34 -10 " +
            "75 -31l118 89q8 7 20 7q11 0 21 -8q144 -133 144 -160q0 -9 -7 -19q-12 -16 -42 -54t-45 " +
            "-60q23 -48 34 -82l152 -23q10 -2 17 -10.5t7 -19.5zM1920 198v-140q0 -16 -149 -31 q-12 -27 " +
            "-30 -52q51 -113 51 -138q0 -4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68q-20 -2 -30 -2t-30 " +
            "2q-14 -21 -52 -68t-46 -47q-2 0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 " +
            "31v140q0 16 149 31q13 29 30 52q-51 113 -51 138q0 4 4 7q4 2 35 20 t59 34t30 16q8 0 46 " +
            "-46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 0 124 -70q4 -3 4 -7q0 -25 -51 -138q17 " +
            "-23 30 -52q149 -15 149 -31zM1920 1222v-140q0 -16 -149 -31q-12 -27 -30 -52q51 -113 51 -138q0 " +
            "-4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68 q-20 -2 -30 -2t-30 2q-14 -21 -52 -68t-46 -47q-2 " +
            "0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 31v140q0 16 149 31q13 29 30 52q-51 113 " +
            "-51 138q0 4 4 7q4 2 35 20t59 34t30 16q8 0 46 -46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 " +
            "0 124 -70 q4 -3 4 -7q0 -25 -51 -138q17 -23 30 -52q149 -15 149 -31z"
        }
    };
    //基本参数
    const elem = $(n),
        id = elem.attr("id").split("-")[1],
        zoom = 0.6, view = icon[id] && icon[id].long;

    //跳过text
    if(id === "text") {
        return;
    }

    elem.append($("<svg>", SVG_NS, {
        "viewBox" : "0 0 " + view + " " + view
    })).append($("<g>", SVG_NS, {
        "transform" : "translate(" + (icon[id]["transform"][0] + (1 - zoom) / 2 * view) +
            "," + (icon[id]["transform"][1] + (1 - zoom) / 2 * view) + ")" +
            " scale(" + zoom + "," + zoom + ")"
    })).append($("<path>", SVG_NS, {
        "d" : icon[id]["d"]
    }));
});

export { iniData, SVG_NS };