const express = require('express');
const cors = require('cors');
const path = require('path');
const jimp = require('jimp');
const fetch = require('node-fetch');
const FormData = require("form-data");
const axios = require('axios');
const { G4F } = require("g4f")
const g4f = new G4F()
const { Prodia } = require("prodia.js");
const prodiakey = "cdffa14f-c399-42b6-af90-ad25be1f8ba6"// API KEY HERE
const googlekey = "AIzaSyAY8DjFZHICDZ-TeHNN6lnEFoB-qczmXxE"
global.creator = 'Mr.one | github/onepunya'
const app = express();
const PORT = process.env.PORT || 3000;
app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware untuk CORS
app.use(cors());
//fungsi random 
async function GetRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
   }

//fungsi buffer 
async function fetchBuffer(file, options = {}) {
const bufet = await (await axios.get(file, { responseType: "arraybuffer", headers: options })).data
return bufet;
}
async function bufferlah(hm) {
const imageUrl = hm;
const imagePath = 'gambar.jpg';

const response= await axios({
  method: 'get',
  url: imageUrl,
  responseType: 'arraybuffer'
})
  const buffer = Buffer.from(response.data, 'binary');
  return buffer;   
}

async function Resize(buffer) {
    var oyy = await jimp.read(buffer);
    var kiyomasa = await oyy.resize(512, 512).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
async function fetchJson(url, options = {}) {
         const result = await (await fetch(url, {
            headers: options
         })).json()
         return result;
   }
//tiktok function
async function ttd(query) {
  return new Promise(async (resolve, reject) => {
    try {
    const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');

      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const videos = response.data.data;
        resolve(videos);
    } catch (error) {
      reject(error);
    }
  });
}   
//function GPT 3
async function gpt3(text) {
const messages = [
    { role: "system", content: "Saya adalah asisten virtual yang dikembangkan oleh OpenAI dengan basis gpt-3.5-turbo. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Ada yang bisa saya bantu?"},
    { role: "user", content: text },
];
const options = {
    provider: g4f.providers.GPT,
    model: "gpt-3.5-turbo",
    debug: true,
    proxy: ""
}

return g4f.chatCompletion(messages, options);
}
async function gpt4(text) {
const messages = [
    { role: "system", content: "Saya adalah asisten virtual yang dikembangkan oleh OpenAI dengan basis gpt-4. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Ada yang bisa saya bantu?"},
    { role: "user", content: text },
];
const options = {
    model: "gpt-4",
    debug: true,
	retry: {
        times: 3,
        condition: (text) => {
            const words = text.split(" ");
            return words.length > 10;
        }
    },
    output: (text) => {
        return text
    }
};
return g4f.chatCompletion(messages, options);    
}
//translate
async function gptTR(text, lang, tar) {
const options = {
    text: text,
    source: lang,
    target: tar
};
    return await g4f.translation(options);
    }
 function TRID() {
 return axios.get("https://rentry.co/3qi3wqnr/raw").then(data => data.data)
  } 
//image to hd
async function tohd(url, scale) {
        const response = await axios.get(`https://` + `aem` + `t.me/` + `remini?url=` + url + `&resolusi=` + scale, {
            headers: {
                'accept': 'application/json'
            }
        });
        return response.data;
}
//function pixiv
async function pixiv(text) {
  return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
    .then(data => data.data.data);
} 
async function pixivr18(text) {
  return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
    .then(data => data.data.data);
} 
//fungsi beta character.ai
async function cai(text, cid) {
const response = await axios.post('https://apigratis.site/api/send_message', {
  external_id: cid,
  message: text
}, {
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
return response.data.result;
 }
async function charid(text) {
const response = await axios.get('https://apigratis.site/api/search_characters', {
  params: {
    query: text
  },
  headers: {
    'accept': 'application/json'
  }
})
return response.data.result.characters;
}
//fungsi VOICEVOX
async function vox(text, speaker) {
const keysi = await GetRandom(["R_m8Q8e8s2r808k", "U282o-0-04r-x_O"])
const urlnya = `https://deprecatedapis.tts.quest/v2/voicevox/audio/?key=${keysi}&speaker=${speaker}&pitch=0&intonationScale=1&speed=1&text=${encodeURIComponent(text)}`
let buf = fetchBuffer(urlnya)
return buf;
}
//fungsi Speaker VOICEVOX
async function spe() {
const urlnya = await fetchJson(`https://deprecatedapis.tts.quest/v2/voicevox/speakers/?key=R_m8Q8e8s2r808k`) 

return urlnya;
} 
//fungsi gemini
async function ask(inputText) {
  // For text-only input, use the gemini-pro model
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + googlekey;
const headers = {
    'Content-Type': 'application/json'
};
const data = {
    contents: [{
        parts: [{
            text: inputText
        }]
    }]
};

const response = await axios.post(url, data, { headers })
        console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
    }
    
// image input gemini vision
async function askImage(inputTextt, inputImage) {
const bufer = await bufferlah(inputImage)
const bup = await Resize(bufer)
    const requestBody = {
        "contents": [
            {
                "parts": [
                    {"text": inputTextt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": bup.toString('base64')
                        }
                    }
                ]
            }
        ]
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${googlekey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    console.log(data);
    return data.candidates[0].content.parts[0].text;
}

//fungsi untuk prodia
async function pprodia(message) {
const prodia = new Prodia(prodiakey);
        const generate = await prodia.generateImage({
            prompt: message,
            model: "majicmixRealistic_v4.safetensors [29d0de58]",
            negative_prompt: "BadDream, (UnrealisticDream:1.3)",
            sampler: "DPM++ SDE Karras",
            cfg_scale: 9,
            steps: 30,
            aspect_ratio: "portrait"
        });
        
        let toy = `https://images.prodia.xyz/${generate.job}.png`;
        
       return toy;
          };
//fungsi black box
async function blackbox(content, web) {
    const url = "https://www.blackbox.ai/api/chat"
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "id-ID,en;q=0.5",
        "Referer": "https://www.blackbox.ai/",
        "Content-Type": "application/json",
        "Origin": "https://www.blackbox.ai",
        "Alt-Used": "www.blackbox.ai"
    }

    const data = {
        messages: [{
            role: "user",
            content
        }],
        id: "chat-free",
        previewToken: null,
        userId: "",
        codeModelMode: true, 
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: "You are BlacBox Ai, a useful AI Model for millions of developers using Blackbox Code Chat that will answer coding questions and help them when writing code.",
        maxTokens: 1024,
        webSearchMode: web,
        promptUrls: "",
        isChromeExt: false,
        githubToken: null
    }

    try {
        const blackboxResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })

        const blackboxData = await blackboxResponse.text()
        return blackboxData
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}
// Endpoint untuk servis dokumen HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './parallax/index.html'));
});
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, './ApiHTML/endpoint.html'));
});
app.get('/api/pixiv_api', (req, res) => {
  res.sendFile(path.join(__dirname, './ApiHTML/pixiv.html'));
}); 

//tiktok
app.get('/api/tiktok-dl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const result = await ttd(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result, 
    });

  } catch (error) {
    res.status(500).json({ error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw" });
  }
});

//translate
app.get('/api/gpt-translate', async (req, res) => {
  try {
    const message = req.query.text;
    const source = req.query.lang
    const target = req.query.target
    const gagal = await TRID()
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
        if (!source && !target) {
      return res.status(200).json({ gagal });
    }

    const data = await gptTR(message, source, target);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      data,
      suport_all_lang: {
       check_url: "https://rentry.co/3qi3wqnr/raw"
       }, 
    });

  } catch (error) {
    res.status(500).json({ error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw" });
  }
});
//GPT 3&4
app.get('/api/gpt-3_5-turbo', async (req, res) => {
  try {
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const data = await gpt3(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         reply: data
              },
      input: {
        text: message
        }, 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/gpt-4_adv', async (req, res) => {
  try {
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const data = await gpt4(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
        reply: data
              }, 
        input: {
        text: message
        }, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//blackbox 
app.get('/api/blackbox', async (req, res) => {
  try {
    const message = req.query.text;
    const web = req.query.webSearchMode
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    if (!web) {
      return res.status(400).json({ error: 'Parameter tidak ditemukan' });
    }

    if (web == "false") {
    const data2 = await blackbox(message, false);
    const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
   res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         text: data2,
         webSearch: web,
         api_url: {
          url: bburl
         }
              }, 

    });  
    } else if (web == "true") {
    const data = await blackbox(message, true);
    const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         text: data,
         webSearch: web,
         api_url: {
          url: bburl
         }
              }, 

    });
    } 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// image to hd
app.get('/api/image2hd', async (req, res) => {
  try {
    const gambar = req.query.url;
    const upscal = req.query.upscale
    if (!gambar) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint' });
 };
if (!upscal) {
      return res.status(400).json({ error: 'Parameter "upscale" tidak ditemukan format 2 , 4 (200% & 400%)' });
 };
 
  const image = await tohd(gambar, upscal);
  const file = await bufferlah(image.url)
    res.status(200).json({
      status: 200,
      creator: global.creator,
      output_image: { 
      url: image.url
      },
      upscale: `${upscal}00%`,
      input_image: { gambar }, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Endpoint untuk prodia
app.get('/api/prodia', async (req, res) => {
  try {
    const message = req.query.prompt;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "prompt" tidak ditemukan' });
    }
    const image = await pprodia(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      data: { image, 
      info: "untuk mengambil hasil gambar mohon tunggu dulu selama 5/10detik, kalau tidak hasil akan eror!"}, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//endpoint gemini
app.get('/api/gemini', async (req, res) => {
  try {
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const data = await ask(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         data
              }, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// endpoint gemini-image
app.get('/api/gemini-vision', async (req, res) => {
  try {
    const gambar = req.query.url
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    if (!gambar) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint' });
 }
    const data = await askImage(message, gambar);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: {
           data 
              }, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//endpoint VOIXEVOX 
app.get('/api/voicevox-synthesis', async (req, res) => {
  try {
    const speakerr = req.query.speaker
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    if (!speakerr) {
      return res.status(400).json({ error: 'Parameter "speaker" tidak ditemukan pastikan susunan endpoint nya sudah benar' });
 }
    const data = await vox(message, speakerr);
       res.set(
      'Content-Type', "audio/mpeg"
    );
        res.send(data);
      } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/voicevox-speaker', async (req, res) => {
  try {
    const data = await spe();
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         data
              }, 

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//endpoint beta character.ai
app.get('/api/beta-character-ai', async (req, res) => {
  try {
    const idnya = req.query.external_id;
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    if (!idnya) {
      return res.status(400).json({ error: 'Parameter "external_id" tidak ditemukan dapatkan external id di "c.ai" atau di endpoint "get-character"' });
    }
    const data = await cai(message, idnya);
    const ccc = data.src_char.participant; 
    const ava = data.src_char.avatar_file_name;
    const rep = data.replies[0].text;
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
         reply: rep, 
         character_name: ccc, 
         avatar: "https://characterai.io/i/80/static/avatars/" + ava
                   }, 
                
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// beta character.ai get character
app.get('/api/get-character', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const data = await charid(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: { 
        character_list: data     
                }, 
                
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//pixiv 
app.get('/api/pixiv', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const data = await pixiv(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: data, 
                
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/pixiv-r18', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const data = await pixivr18(message);
    res.status(200).json({
      status: 200,
      creator: global.creator,
      result: data,   
                 
                
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Handle error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app