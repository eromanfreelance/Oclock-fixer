
// nous testons si la page est entiérement chargé avant de lancer nos script jQuery
$( document ).ready(function() {
    console.log( "la page est chargé" );// un message dans la console pour nous dire que la page est chargé

    // valeur par defaut du message afficher
    const affichage ="Merci de remplir un montant en euro et choisir une devise pour lancer la conversion";
    afficheHtml();

    $("#euro").on('keyup click', function(e) { 
        // lancement de la fonction de calcul si on rentre un chiffre ou sur click
        calculDevise();
    });


    // requette pour récupérer la liste des devises
    $.get("http://data.fixer.io/api/symbols?access_key=687950f449432d2ef5d72107999d942b", function(data, status){
        if (data.success === true){
            let select = $("#devise"); 
            console.log( "les devise sont chargés" );// récupération des devises ok
            // création du select
            $.each(data.symbols, function(key, value) {  
                select.append(`<option value="${key}"> ${key}-${value}</option>`);                 
           });
        }else{
            // erreur de communication avec les serveurs
            afficheHtml('Un probléme de communication avec les api ne nous permet de vous fournir le service');
        }
      });

      // détection de la sélection d'une devise
      $("#devise").change(function(){
          console.log('la devise selectionné est ', $(this).val());
          // lancement de la fonction de calcul
          calculDevise();
      })

      // fonction de calcul
      function calculDevise(){
          console.log("calcul devise");
          
          let euro=$("#euro").val() || 0; //récupération du montant en euro
          let devise = $("#devise").val() || ""; //récupération de la devise
          let conversion = null;
          let nomDevise = "";
          
          // récupération du nom de la devise
          if (devise.length === 3){
            let string = $("#devise option:selected").text();
            nomDevise = string.substring(string.lastIndexOf(" ")+1, string.length);
            console.log("nom devise :",nomDevise); 
          }
        
          // début du calcul si on a un montant positif et une devise choisie
          if (euro > 0 && devise.length === 3){
              console.log("appel de l'api de conversion");
              // construction de l'url avec les parametre
              let url = `http://data.fixer.io/api/latest?access_key=687950f449432d2ef5d72107999d942b`;
              url +=`&base=EUR&symbols=${devise}`;
              console.log("lancement de la requette pour recupérer le taux de change pour la devise ",devise); 
              // récupération du taux de change de la devise selectionnée   
              $.get(url, function(data, status){
                if (data.success === true){
                    conversion = euro * data.rates[devise];
                    conversion = roundDecimal(conversion,2); // on arrondi à 2 chiffres après la virgule
                    console.log("le montant de la conversion est : ",conversion,nomDevise);
                    $("#afficheConversion").html(conversion);
                    reponse = `${euro} € est égal à ${conversion} ${nomDevise}`;
                    afficheHtml(reponse);
                }else{
                    afficheHtml('Un probléme de communication avec les api ne nous permet de vous fournir le service');
                }
              });
          }   
      }// fin calculDevise


      // fontion pour Afficher le résultat
      function afficheHtml(texte = affichage){
          $("#affichage").html(texte);
      }

      // fonction pour arrondir un chiffre à n chiffre après la virgulle
      function roundDecimal(nombre, precision){
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round( nombre*tmp )/tmp;
    }

    
});